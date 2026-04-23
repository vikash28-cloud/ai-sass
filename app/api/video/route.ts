import { auth } from "@clerk/nextjs/server";
import { GenerateVideosOperation, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const MODEL = "veo-3.1-generate-preview";

const aspectRatioMap: Record<string, string> = {
  landscape_16_9: "16:9",
  portrait_16_9: "9:16",
  square_hd: "1:1",
};

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
}

function createClient(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

function toDataUrl(videoBytes: string, mimeType?: string) {
  return `data:${mimeType || "video/mp4"};base64,${videoBytes}`;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, videoSize = "landscape_16_9" } = body;
    const apiKey = getGeminiApiKey();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("GEMINI_VIDEO_API_KEY or GEMINI_API_KEY is not configured", {
        status: 500,
      });
    }

    if (!prompt || typeof prompt !== "string") {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const ai = createClient(apiKey);
    const operation = await ai.models.generateVideos({
      model: MODEL,
      prompt,
      config: {
        aspectRatio: aspectRatioMap[videoSize] || "16:9",
        numberOfVideos: 1,
      },
    });

    if (!operation.name) {
      throw new Error("Gemini did not return an operation name.");
    }

    return NextResponse.json(
      {
        operationName: operation.name,
        status: "pending",
      },
      { status: 202 }
    );
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return NextResponse.json(
      {
        error: "Video generation failed",
        message: error instanceof Error ? error.message : "Unknown video error",
      },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const operationName = searchParams.get("operationName");
    const prompt = searchParams.get("prompt") || "";
    const apiKey = getGeminiApiKey();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("GEMINI_VIDEO_API_KEY or GEMINI_API_KEY is not configured", {
        status: 500,
      });
    }

    if (!operationName) {
      return new NextResponse("operationName is required", { status: 400 });
    }

    const ai = createClient(apiKey);
    const operationRef = new GenerateVideosOperation();
    operationRef.name = operationName;
    const operation = await ai.operations.getVideosOperation({
      operation: operationRef,
    });

    if (!operation.done) {
      return NextResponse.json({
        status: "pending",
      });
    }

    const generatedVideo = operation.response?.generatedVideos?.[0]?.video;
    if (!generatedVideo) {
      throw new Error("Gemini completed the request but did not return a video.");
    }

    const url =
      generatedVideo.uri ||
      (generatedVideo.videoBytes ? toDataUrl(generatedVideo.videoBytes, generatedVideo.mimeType) : null);

    if (!url) {
      throw new Error("Gemini returned a video without a usable URL or bytes.");
    }

    return NextResponse.json({
      status: "succeeded",
      video: {
        url,
        prompt,
        seed: null,
      },
    });
  } catch (error) {
    console.log("[VIDEO_STATUS_ERROR]", error);
    return NextResponse.json(
      {
        error: "Video status failed",
        message: error instanceof Error ? error.message : "Unknown video status error",
      },
      { status: 502 }
    );
  }
}
