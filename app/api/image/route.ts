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
        const { prompt, amount=1,resolution="512x512"  } = body;
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!process.env.GEMINI_API_KEY) {
            return new NextResponse("API key is not configured", { status: 500 });
        }
        if (!prompt) {
            return new NextResponse("Messages are required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("Messages are required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Messages are required", { status: 400 });
        }
       

        

        

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}