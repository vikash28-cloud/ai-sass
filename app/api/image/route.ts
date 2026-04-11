import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const DEFAULT_RESOLUTION = "512x512";
const DEFAULT_AMOUNT = 1;
const MAX_AMOUNT = 4;
const MODEL = "black-forest-labs/FLUX.1-schnell";

const resolutionMap: Record<string, { width: number; height: number }> = {
  "256x256": { width: 256, height: 256 },
  "512x512": { width: 512, height: 512 },
  "1024x1024": { width: 1024, height: 1024 },
};

function parseImageError(status: number, body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: string; message?: string };
    return parsed.error || parsed.message || `Image request failed with status ${status}`;
  } catch {
    return body || `Image request failed with status ${status}`;
  }
}

async function generateSingleImage(
  prompt: string,
  width: number,
  height: number,
  seed: number,
  apiKey: string
) {
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
          seed,
        },
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(parseImageError(response.status, errorBody));
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const imageBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(imageBuffer).toString("base64");

  return {
    url: `data:${contentType};base64,${base64}`,
    prompt,
    width,
    height,
    model: MODEL,
  };
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const {
      prompt,
      amount = DEFAULT_AMOUNT,
      resolution = DEFAULT_RESOLUTION,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new NextResponse("HUGGINGFACE_API_KEY is not configured", {
        status: 500,
      });
    }

    if (!prompt || typeof prompt !== "string") {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const parsedAmount = Number.parseInt(String(amount), 10);
    if (Number.isNaN(parsedAmount) || parsedAmount < 1 || parsedAmount > MAX_AMOUNT) {
      return new NextResponse("Amount must be between 1 and 4", { status: 400 });
    }

    const size = resolutionMap[resolution] ?? resolutionMap[DEFAULT_RESOLUTION];

    const images = await Promise.all(
      Array.from({ length: parsedAmount }, (_, index) =>
        generateSingleImage(
          prompt,
          size.width,
          size.height,
          Date.now() + index,
          process.env.HUGGINGFACE_API_KEY as string
        )
      )
    );

    return NextResponse.json(images);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return NextResponse.json(
      {
        error: "Image generation failed",
        message: error instanceof Error ? error.message : "Unknown image error",
      },
      { status: 502 }
    );
  }
}
