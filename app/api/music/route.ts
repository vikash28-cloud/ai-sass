import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const MODEL = "lyria-3-clip-preview";

function getGeminiApiKey() {
  return process.env.GEMINI_MUSIC_API_KEY || process.env.GEMINI_API_KEY || "";
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const apiKey = getGeminiApiKey();
    const body = await req.json();
    const prompt = body?.prompt;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("GEMINI_API_KEY is not configured", { status: 500 });
    }

    if (!prompt || typeof prompt !== "string") {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const textParts: string[] = [];
    let audioData: string | null = null;
    let mimeType = "audio/mpeg";

    for (const part of parts) {
      if (part.text) {
        textParts.push(part.text);
      }

      if (part.inlineData?.data) {
        audioData = part.inlineData.data;
        mimeType = part.inlineData.mimeType || mimeType;
      }
    }

    if (!audioData) {
      return NextResponse.json(
        {
          error: "Music generation failed",
          message: textParts.join("\n") || "Gemini did not return audio.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      audio: `data:${mimeType};base64,${audioData}`,
      mimeType,
      text: textParts.join("\n"),
      model: MODEL,
    });
  } catch (error) {
    console.log("[MUSIC_GENERATION_ERROR]", error);
    return NextResponse.json(
      {
        error: "Music generation failed",
        message: error instanceof Error ? error.message : "Unknown music generation error",
      },
      { status: 502 }
    );
  }
}
