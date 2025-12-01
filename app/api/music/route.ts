import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY||"",

})
export async function POST(req: Request) {
    try {
        console.log("hello");
        const userId = auth();
        const body = await req.json();
        // console.log(body);
        const { prompt } = body;
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!process.env.REPLICATE_API_KEY) {
            return new NextResponse("API key is not configured", { status: 500 });
        }
        if (!prompt) {
            return new NextResponse("prompt are required", { status: 400 });
        }
        const music = prompt.map((m: any) => `${m.role}: ${m.content}`).join("\n");

        
   const response = ""

        return NextResponse.json({
            role: "assistant",
            content: response,
        });

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}