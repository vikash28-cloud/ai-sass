import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BASE_URL = "https://api.aimusicapi.ai";
const CREATE_ENDPOINT = `${BASE_URL}/api/v1/sonic/create`;
const TASK_ENDPOINT = `${BASE_URL}/api/v1/sonic/task`;
const MODEL = "sonic-v4";
type CreatedTask = {
  code?: number;
  message?: string;
  task_id?: string;
};

type MusicTrack = {
  audio_url?: string;
  title?: string;
  tags?: string;
  duration?: number;
  mv?: string;
  state?: string;
};

type TaskResponse = {
  code?: number;
  message?: string;
  data?: MusicTrack[];
};

function parseApiError(status: number, body: string) {
  try {
    const parsed = JSON.parse(body) as { error?: string; message?: string; type?: string };
    return parsed.error || parsed.message || parsed.type || `Music request failed with status ${status}`;
  } catch {
    return body || `Music request failed with status ${status}`;
  }
}

async function createMusicTask(prompt: string, apiKey: string) {
  const response = await fetch(CREATE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_type: "create_music",
      custom_mode: false,
      mv: MODEL,
      make_instrumental: true,
      title: "Generated Track",
      tags: "instrumental",
      gpt_description_prompt: prompt,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(parseApiError(response.status, errorBody));
  }

  const json = (await response.json()) as CreatedTask;
  if (!json.task_id) {
    throw new Error(json.message || "Music provider did not return a task id.");
  }

  return json.task_id;
}

async function getTaskResult(taskId: string, apiKey: string) {
  const response = await fetch(`${TASK_ENDPOINT}/${taskId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(parseApiError(response.status, errorBody));
  }

  return (await response.json()) as TaskResponse;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt } = body;
    const apiKey = process.env.AIMUSIC_API_KEY || "";

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("AIMUSIC_API_KEY is not configured", { status: 500 });
    }

    if (!prompt || typeof prompt !== "string") {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const taskId = await createMusicTask(prompt, apiKey);

    return NextResponse.json(
      {
        taskId,
        prompt,
        status: "pending",
      },
      { status: 202 }
    );
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return NextResponse.json(
      {
        error: "Music generation failed",
        message: error instanceof Error ? error.message : "Unknown music error",
      },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    const prompt = searchParams.get("prompt") || "";
    const apiKey = process.env.AIMUSIC_API_KEY || "";

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("AIMUSIC_API_KEY is not configured", { status: 500 });
    }

    if (!taskId) {
      return new NextResponse("taskId is required", { status: 400 });
    }

    const task = await getTaskResult(taskId, apiKey);
    const tracks = task.data ?? [];
    const readyTracks = tracks.filter((track) => track.state === "succeeded" && track.audio_url);

    if (readyTracks.length > 0) {
      return NextResponse.json({
        taskId,
        status: "succeeded",
        tracks: readyTracks.map((track, index) => ({
          url: track.audio_url as string,
          title: track.title || `Generated Track ${index + 1}`,
          tags: track.tags || "instrumental",
          duration: track.duration || 0,
          model: track.mv || MODEL,
          prompt,
        })),
      });
    }

    const failedTrack = tracks.find((track) => track.state === "failed");
    if (failedTrack) {
      return NextResponse.json(
        {
          error: "Music generation failed",
          message: "Music generation failed on the provider.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      taskId,
      status: "pending",
    });
  } catch (error) {
    console.log("[MUSIC_STATUS_ERROR]", error);
    return NextResponse.json(
      {
        error: "Music status failed",
        message: error instanceof Error ? error.message : "Unknown music status error",
      },
      { status: 502 }
    );
  }
}
