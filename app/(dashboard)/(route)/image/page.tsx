"use client";

import * as z from "zod";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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

import { amountOptions, formSchema, resolutionOptions } from "./constants";

type GeneratedImage = {
  url: string;
  prompt: string;
  width: number;
  height: number;
};

const ImagePage = () => {
  const router = useRouter();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "256x256",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      setError(null);
      const response = await axios.post("/api/image", values);
      setImages(response.data);
      form.reset();
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (typeof error.response?.data === "string") {
          setError(error.response.data);
        } else if (typeof error.response?.data?.message === "string") {
          setError(error.response.data.message);
        } else {
          setError("Failed to generate images.");
        }
      } else {
        setError("Failed to generate images.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Generate images with Hugging Face"
        icon={ImageIcon}
        bgColor="bg-pink-500/10 "
        iconColor="text-pink-500"
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-12 gap-2 rounded-lg border border-gray-700 p-4 px-3 focus-within:shadow-sm md:px-6"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="e.g A white tiger in cinematic lighting"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
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
                          <SelectValue defaultValue={field.value} placeholder="Amount" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolution"
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
                          <SelectValue defaultValue={field.value} placeholder="Resolution" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
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
            <div className="p-20">
              <Loader />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {images.length === 0 && !isLoading && !error && (
            <Empty label="No images generated yet." />
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                <Image
                  src={image.url}
                  alt={image.prompt}
                  width={image.width}
                  height={image.height}
                  unoptimized
                  className="h-auto w-full object-cover"
                />
                <div className="space-y-2 p-3">
                  <p className="text-sm text-gray-700">{image.prompt}</p>
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex text-sm font-medium text-pink-600 hover:text-pink-700"
                  >
                    Open image
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
