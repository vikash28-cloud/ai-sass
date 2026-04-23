"use client";

import * as z from "zod";
import axios from "axios";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Empty from "@/components/empty";
import { Heading } from "@/components/heading";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formSchema, sizeOptions } from "./constants";

type GeneratedVideo = {
  url: string;
  prompt: string;
  seed: number | null;
};

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<GeneratedVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      videoSize: "landscape_16_9",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const pollTask = async (operationName: string, prompt: string) => {
    const maxAttempts = 24;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 10000));

      const response = await axios.get("/api/video", {
        params: { operationName, prompt },
      });

      if (response.data.status === "succeeded") {
        setVideo(response.data.video);
        setStatusMessage(null);
        return;
      }

      setStatusMessage("Video generation is running in Gemini. This can take a few minutes.");
    }

    setStatusMessage("Still processing. Try again in a bit.");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(null);
      setError(null);
      setStatusMessage("Submitting video generation request...");

      const response = await axios.post("/api/video", values);

      if (response.data?.operationName) {
        setStatusMessage("Video generation is queued in Gemini. Waiting for Veo to finish...");
        await pollTask(response.data.operationName, values.prompt);
      }

      form.reset({
        prompt: "",
        videoSize: values.videoSize,
      });
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (typeof error.response?.data === "string") {
          setError(error.response.data);
        } else if (typeof error.response?.data?.message === "string") {
          setError(error.response.data.message);
        } else {
          setError("Failed to generate video.");
        }
      } else {
        setError("Failed to generate video.");
      }
      setStatusMessage(null);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Generate short prompt-based videos with Gemini Veo"
        icon={Video}
        bgColor="bg-orange-500/10 "
        iconColor="text-orange-500"
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-12 gap-2 rounded-lg border p-4 px-3 focus-within:shadow-sm md:px-6"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="e.g A cinematic drone shot over neon city streets in the rain"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoSize"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-6 lg:col-span-2">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 w-full lg:col-span-2"
                disabled={isLoading}
                variant="default"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-6 space-y-4">
          {isLoading && (
            <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
              <Loader />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {statusMessage && !error && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
              {statusMessage}
            </div>
          )}

          {!video && !isLoading && !error && !statusMessage && (
            <Empty label="No video generated yet." />
          )}

          {video && (
            <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
              <div>
                <p className="text-sm font-medium text-gray-900">{video.prompt}</p>
                {video.seed !== null && (
                  <p className="text-xs text-gray-500">Seed: {video.seed}</p>
                )}
              </div>

              <video controls className="w-full rounded-lg bg-black">
                <source src={video.url} />
                Your browser does not support video playback.
              </video>

              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Open video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
