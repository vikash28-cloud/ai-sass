import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
export async function POST(req: Request) {
  try {
    const userId = auth();
    const body = await req.json();
    // console.log(body);
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!process.env.REPLICATE_API_TOKEN) {
      return new NextResponse("API key is not configured", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("prompt are required", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("amount are required", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("resolution are required", { status: 400 });
    }

    const input = {
      prompt: prompt,
      aspect_ratio: "16:9",
      output_format: "jpg",
      safety_filter_level: "block_medium_and_above",
    };
   const output = await replicate.run("google/imagen-4", { input });

    console.log(output);
    return NextResponse.json({
      role: "assistant",
      content: output
    });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
