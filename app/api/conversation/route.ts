import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: Request) {
    try {
        console.log("hello");
        const userId = auth();
        const body = await req.json();
        // console.log(body);
        const { messages } = body;
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!process.env.GEMINI_API_KEY) {
            return new NextResponse("API key is not configured", { status: 500 });
        }
        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }
        const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join("\n");

        const model = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const responseText = model.text;

        return NextResponse.json({
            role: "assistant",
            content: responseText,
        });

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}