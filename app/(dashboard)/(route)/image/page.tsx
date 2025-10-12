"use client";
import * as z from "zod"
import { Heading } from "@/components/heading"
import { ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { amountOptions, formSchema, resolutionOptions } from "./constants";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    // validation of form using zod 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "256x256"
        }
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);
            // console.log(values);
            const response = await axios.post("/api/image", values);
            const urls = response.data.map((image: { url: string }) => image.url);
            setImages(urls);
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
            <Heading title="Image Generation" description="Most advance Image model" icon={ImageIcon} bgColor="bg-pink-500/10 " iconColor="text-pink-500" />

            {/* form section */}

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border border-gray-700 w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="e.g A white siamese cat"
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
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue defaultValue={field.value} placeholder="Amount" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option)=>(
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                                    <FormItem className="col-span-12 lg:col-span-10">
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
                                                {resolutionOptions.map((option)=>(
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>



                                        </Select>

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
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}

                    {/* Empty State */}
                    {images.length === 0 && !isLoading && (
                        <Empty label="No images generated yet." />
                    )}

                    {/* Photos */}
                    <div>
                        images will be rendered here
                    </div>

                </div>

            </div>



        </div>

    )
}


export default ImagePage