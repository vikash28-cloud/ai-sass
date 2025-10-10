"use client";
import * as z from "zod"
import { Heading } from "@/components/heading"
import { MessageSquare } from "lucide-react"
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

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}


const ConversationPage = () => {
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
            const response = await axios.post("/api/conversation", {
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
            <Heading title="Conversation" description="most advance conversation model" icon={MessageSquare} bgColor="bg-violet-500/10 " iconColor="text-violet-500" />

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
                                                placeholder="e.g my name is vikash tell me a joke"
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
                    <div className="flex flex-col gap-3">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex w-full",
                                    message.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] sm:max-w-[70%] px-4 py-2 text-sm rounded-lg break-words",
                                        message.role === "user"
                                            ? "bg-white border border-gray-500  text-black rounded-br-none"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
                                    )}
                                >
                                    {message.role ==="user"?<UserAvatar/>:<BotAvatar/>}
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>



        </div>

    )
}


export default ConversationPage