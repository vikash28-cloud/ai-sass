"use client";
import * as z from "zod"
import { Heading } from "@/components/heading"
import { Code } from "lucide-react"
import { useForm } from "react-hook-form"
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
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}


const CodePage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // validation of form using zod 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatMessage = {
                role: "user",
                content: values.prompt
            }
            const newMessages = [...messages, userMessage];
            const response = await axios.post("/api/code", {
                messages: newMessages,
            })
            setMessages((current) => [...current, userMessage, response.data]);
            form.reset();
        } catch (error: any) {
            console.log(error);
        } finally {
            router.refresh();
        }
    }
    return (

        <div>
            {/* heading section */}
            <Heading title="Code Generation" description="most advance Code Generation model" icon={Code} bgColor="bg-green-700/10 " iconColor="text-green-700" />

            {/* form section */}

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
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
                                                placeholder="Write a python function to reverse a string"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>

                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading} variant="default" >
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
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started yet." />
                    )}

                    {/* Messages */}
                    <div className="flex flex-col gap-4 px-3 sm:px-6 py-4 w-full">
                        {messages.map((message, index) => {
                            const isUser = message.role === "user";
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex w-full items-start animate-fade-in",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {/* Avatar */}
                                    {!isUser && (
                                        <div className="mr-3 flex-shrink-0">
                                            <BotAvatar />
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div
                                        className={cn(
                                            "relative group px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-300 ease-in-out",
                                            "max-w-[80%] sm:max-w-[70%] break-words leading-relaxed",
                                            isUser
                                                ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-br-none hover:shadow-md"
                                                : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-bl-none hover:shadow-md"
                                        )}
                                        // 👇 Scrollable only for assistant messages
                                        style={!isUser ? { maxHeight: "350px", overflowY: "auto" } : {}}
                                    >
                                        <ReactMarkdown >
                                            {message.content || ""}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Avatar on the right for user */}
                                    {isUser && (
                                        <div className="ml-3 flex-shrink-0">
                                            <UserAvatar />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>



        </div>

    )
}


export default CodePage