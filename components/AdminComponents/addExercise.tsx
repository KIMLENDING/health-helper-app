'use client';
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import TagSelector from './addTag';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
    url: z.string().min(2),
})

export const AddExercise = () => {
    const [dbTags, setDbTags] = useState<string[]>([]);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            url: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const postData = {
                title: values.title,
                description: values.description,
                url: values.url,
                tags: dbTags
            }

            const response = await fetch('/api/admin/exercise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                toast({ variant: "destructive", title: `HTTP error! status: ${response.status}` })
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            toast({ variant: "default", title: data.message })
            form.reset();
            // TODO: Add success handling (e.g., show success message, reset form)

        } catch (error) {
            toast({ variant: "destructive", title: "status 500" })
            console.error('Error submitting form:', error);
            // TODO: Add error handling (e.g., show error message to user)
        }
    }
    return (
        <div className="mx-auto  min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
            <Card>
                <CardHeader>
                    <CardTitle>Add Exercise</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>운동 이름</FormLabel>
                                        <FormControl>
                                            <Input placeholder="운동 이름을 입력해주세요." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            운동 이름은 2자 이상 50자 이하로 입력해주세요.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>설명</FormLabel>
                                        <FormControl>
                                            <Input placeholder="설명을 입력해주세요." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            설명은 2자 이상 50자 이하로 입력해주세요.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>참고 영상 URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="URL을 입력해주세요." {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <TagSelector dbTags={dbTags} setDbTags={setDbTags} />
                            </div>
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>


        </div>
    )
}
