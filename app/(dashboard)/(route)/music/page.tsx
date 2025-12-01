"use client";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare, Music } from "lucide-react";
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


export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MusicPage = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string>();
  // validation of form using zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        setMusic(undefined);
     
      const response = await axios.post("/api/music")
      form.reset();
    } catch (error: any) {
      console.log(error);
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

          {/* Empty State */}
          {!music && !isLoading && (
            <Empty label="No Music generated yet" />
          )}

          {/* rendering Messages */}

          <div>
            music will be generated here
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
