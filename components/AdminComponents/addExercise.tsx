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
import { Textarea } from "@/components/ui/textarea"
import TagSelector from './addTag';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { addExercise } from '@/server/admin/mutations';
import { Dumbbell, Link as LinkIcon, Info, Tag, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(2, {
        message: "운동 이름은 최소 2자 이상이어야 합니다."
    }).max(50, {
        message: "운동 이름은 최대 50자까지 입력 가능합니다."
    }),
    description: z.string().min(2, {
        message: "설명은 최소 2자 이상이어야 합니다."
    }).max(200, {
        message: "설명은 최대 200자까지 입력 가능합니다."
    }),
    url: z.string().url({
        message: "유효한 URL 형식이 아닙니다."
    }),
})

export const AddExercise = () => {
    const [dbTags, setDbTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addExerciseMutation = addExercise();

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
        if (dbTags.length === 0) {
            toast({
                title: "태그를 선택해주세요",
                description: "최소 한 개 이상의 태그가 필요합니다.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const postData = {
                title: values.title,
                description: values.description,
                url: values.url,
                tags: dbTags
            }

            await addExerciseMutation.mutateAsync(postData);

            toast({
                title: "운동 추가 성공!",
                description: `"${values.title}" 운동이 성공적으로 추가되었습니다.`,
                variant: "default",
            });

            form.reset();
            setDbTags([]);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: "오류가 발생했습니다.",
                description: "이름이 중복될 수 있습니다. ",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-h-screen w-full  max-w-4xl py-4">
            <Card className="shadow-md border-emerald-100 dark:border-emerald-800/30">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b pb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-full">
                            <Dumbbell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">새 운동 추가</CardTitle>
                            <CardDescription className="text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                                데이터베이스에 추가할 새로운 운동 정보를 입력해주세요
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-base">
                                            <Dumbbell className="h-4 w-4" />
                                            운동 이름
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="예: 벤치프레스, 스쿼트, 데드리프트"
                                                {...field}
                                                className="focus-visible:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
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
                                        <FormLabel className="flex items-center gap-2 text-base">
                                            <Info className="h-4 w-4" />
                                            운동 설명
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="운동에 대한 간략한 설명을 입력해주세요."
                                                className="min-h-24 resize-none focus-visible:ring-emerald-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            설명은 2자 이상 200자 이하로 입력해주세요.
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
                                        <FormLabel className="flex items-center gap-2 text-base">
                                            <LinkIcon className="h-4 w-4" />
                                            참고 영상 URL
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="예: https://youtube.com/watch?v=..."
                                                {...field}
                                                className="focus-visible:ring-emerald-500"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            운동 방법을 보여주는 동영상의 URL을 입력해주세요.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <FormLabel className="flex items-center gap-2 text-base mb-2 ">
                                    <Tag className="h-4 w-4" />
                                    운동 태그
                                </FormLabel>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border">
                                    <TagSelector dbTags={dbTags} setDbTags={setDbTags} />
                                </div>
                                <FormDescription className="text-xs mt-2">
                                    최소 한 개 이상의 태그를 선택해주세요. (예: 상체, 하체, 유산소)
                                </FormDescription>
                                {dbTags.length === 0 && (
                                    <p className="text-red-500 text-xs mt-1">태그를 선택해주세요</p>
                                )}
                            </div>

                            <div className="rounded-md p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                                <div className="text-sm text-emerald-700 dark:text-emerald-300">
                                    <p className="font-medium">운동 데이터 등록 안내</p>
                                    <p className="mt-1 text-emerald-600/90 dark:text-emerald-400/90 text-xs">
                                        정확한 운동 정보 입력은 사용자들의 올바른 운동 방법 습득에 도움이 됩니다.
                                        정확한 이름과 설명, 그리고 고품질의 참고 영상을 연결해주세요.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6 bg-gray-50 dark:bg-gray-800/20">
                    <Button
                        variant="outline"
                        onClick={() => {
                            form.reset();
                            setDbTags([]);
                        }}
                        disabled={isSubmitting}
                        className="border-gray-300"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting || dbTags.length === 0}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                처리 중...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                운동 추가하기
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}