"use client";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Empty from "@/components/empty";
import Loader from "@/components/loader";

type GeneratedMusicTrack = {
  url: string;
  prompt: string;
  model: string;
  title: string;
  tags: string;
  duration: number;
};

const MusicPage = () => {
  const router = useRouter();
  const [tracks, setTracks] = useState<GeneratedMusicTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  // validation of form using zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const pollTask = async (taskId: string, prompt: string) => {
    const maxAttempts = 18;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 10000));

      const response = await axios.get("/api/music", {
        params: { taskId, prompt },
      });

      if (response.data.status === "succeeded") {
        setTracks(response.data.tracks || []);
        setStatusMessage(null);
        return;
      }
    }

    setStatusMessage("Still processing. Try again in a bit.");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setTracks([]);
      setError(null);
      setStatusMessage("Creating your track...");

      const response = await axios.post("/api/music", values);

      if (response.data?.taskId) {
        setStatusMessage("Music generation is running. This can take around 1-3 minutes.");
        await pollTask(response.data.taskId, values.prompt);
      }

      form.reset();
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (typeof error.response?.data === "string") {
          setError(error.response.data);
        } else if (typeof error.response?.data?.message === "string") {
          setError(error.response.data.message);
        } else {
          setError("Failed to generate music.");
        }
      } else {
        setError("Failed to generate music.");
      }
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      {/* heading section */}
      <Heading
        title="Music"
        description="Turn your prompt into music"
        icon={Music}
        bgColor="bg-emerald-500/10 "
        iconColor="text-emerald-500"
      />

      {/* form section */}

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="E.g Piano solo"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
                variant="default"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="mt-6 space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="p-6 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Loader />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {statusMessage && !error && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {statusMessage}
            </div>
          )}

          {/* Empty State */}
          {tracks.length === 0 && !isLoading && !error && !statusMessage && (
            <Empty label="No Music generated yet" />
          )}

          <div className="space-y-4">
            {tracks.map((track, index) => (
              <div key={`${track.url}-${index}`} className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-gray-900">{track.title}</p>
                  <p className="text-xs text-gray-500">
                    {track.model} | {track.tags} | {track.duration}s
                  </p>
                  <p className="mt-2 text-sm text-gray-600">{track.prompt}</p>
                </div>

                <audio controls className="w-full">
                  <source src={track.url} />
                  Your browser does not support audio playback.
                </audio>

                <a
                  href={track.url}
                  download={`${track.title}.mp3`}
                  className="inline-flex text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Download audio
                </a>
              </div>
            ))}
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
