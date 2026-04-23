"use client";

import * as z from "zod";
import axios from "axios";
import { Download, Music, Sparkles, Wand2, Waves } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { formSchema } from "./constants";

const MusicPage = () => {
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setAudioUrl(null);
      setGeneratedText(null);
      setError(null);

      const response = await axios.post("/api/music", {
        prompt: values.prompt,
      });

      setAudioUrl(response.data.audio);
      setGeneratedText(response.data.text || null);
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
        setError(error instanceof Error ? error.message : "Failed to generate music.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Music"
        description="Type a prompt and generate a 30-second Lyria 3 music clip"
        icon={Music}
        bgColor="bg-emerald-500/10 "
        iconColor="text-emerald-500"
      />

      <div className="px-4 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#022c22,#064e3b_45%,#111827)] p-6 text-white shadow-2xl shadow-emerald-950/20 md:p-8">
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-emerald-300/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Powered by Lyria 3 Clip
                </div>
                <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
                  Turn one idea into a finished track.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/80">
                  Describe the mood, genre, instruments, or lyrics. The model returns a clean
                  30-second MP3 you can play and download.
                </p>
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl md:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-300 text-emerald-950">
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Music prompt</p>
                    <p className="text-xs text-emerald-50/70">Be specific for better results</p>
                  </div>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-12 gap-3"
                  >
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem className="col-span-12 md:col-span-9">
                          <FormControl className="m-0 p-0">
                            <Input
                              className="h-12 border-white/10 bg-white/95 px-4 text-gray-950 outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-emerald-300"
                              disabled={isLoading}
                              placeholder="E.g. cinematic lo-fi beat with warm piano and soft drums"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      className="col-span-12 h-12 w-full bg-emerald-300 font-semibold text-emerald-950 hover:bg-emerald-200 md:col-span-3"
                      disabled={isLoading}
                      variant="default"
                    >
                      {isLoading ? "Creating..." : "Generate"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {isLoading && (
              <div className="overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                    <Loader />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Generating your track</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Lyria is composing the audio, structure, and music details.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex h-16 items-end gap-1.5">
                  {Array.from({ length: 28 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full rounded-full bg-emerald-500/70"
                      style={{
                        height: `${22 + ((index * 17) % 42)}px`,
                        opacity: 0.35 + ((index % 5) * 0.12),
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                <div className="border-b bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                        <Waves className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-950">Generated music</p>
                        <p className="text-sm text-gray-500">30-second MP3 clip ready to play</p>
                      </div>
                    </div>

                    <a
                      href={audioUrl}
                      download="lyria-3-music.mp3"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-gray-950 px-4 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>

                <div className="p-5">
                  <audio className="w-full" src={audioUrl} controls />
                </div>
              </div>
            )}

            {generatedText && (
              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-950">
                  <Music className="h-4 w-4 text-emerald-600" />
                  Track details
                </div>
                <div className="whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {generatedText}
                </div>
              </div>
            )}

            {!isLoading && !error && !audioUrl && (
              <div className="rounded-3xl border border-dashed bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Music className="h-7 w-7" />
                </div>
                <Empty label="Enter a prompt to generate music" />
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Try prompts like &quot;uplifting synthwave for a product launch&quot; or
                  &quot;soft piano background for a study video.&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
