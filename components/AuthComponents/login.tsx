"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {

    const router = useRouter();
    const { toast } = useToast()
    const [error, setError] = useState("");

    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/dashboard");
        }
    }, [sessionStatus, router, session]);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        if (!isValidEmail(email)) {
            setError("이메일 형식이 유효하지 않습니다.");
            toast({ variant: "destructive", title: "이메일 형식이 유효하지 않습니다." })
            return;
        }

        if (!password || password.length < 8) {
            setError("비밀번호가 틀리거나 8자 이상이어야 합니다.");
            toast({ variant: "destructive", title: "비밀번호가 틀리거나 8자 이상이어야 합니다." })
            return;
        }

        const res = await signIn("credentials", { // next-auth CredentialsProvider를 사용하여 로그인
            redirect: false,
            email,
            password,
        });
        res?.url
        if (res?.error) {
            setError("이메일 또는 비밀번호가 유효하지 않습니다.");
            toast({ variant: "destructive", title: "이메일 또는 비밀번호가 유효하지 않습니다." })
            if (res?.url) router.replace(res?.url); // 로그인 실패시 로그인 페이지로 이동
        } else {
            setError("");
            toast({ variant: "destructive", title: "로그인 성공" })
            router.replace("/"); // 홈으로 이동
        }
    };

    if (sessionStatus === "loading") {
        return <h1>Loading...</h1>;
    }
    return (
        <div className="flex h-screen w-full items-center justify-center px-4 ">
            <Card className="mx-auto max-w-sm  ">
                <CardHeader>
                    <CardTitle className="text-2xl dark:text-white">계정 로그인</CardTitle>
                    <CardDescription >
                        계정에 로그인하려면 아래에 이메일을 입력하세요
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" >Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"

                                    required

                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" >비밀번호</Label>
                                    {/* <Link
                                        href="#"
                                        className="ml-auto inline-block text-sm underline dark:text-gray-300"
                                    >
                                        Forgot your password?
                                    </Link> */}
                                </div>
                                <Input id="password" type="password" placeholder="비밀번호" required />
                            </div>
                            <Button type="submit" className="w-full ">
                                로그인
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                signIn("google");
                            }}
                            className="flex w-full items-center border border-gray-300 justify-center gap-3 rounded-md bg-white px-3 py-1.5 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <FcGoogle />
                            <span className="text-sm font-semibold leading-6">
                                Google
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                signIn("github");
                            }}
                            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                        >
                            <svg
                                className="h-5 w-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-semibold leading-6">
                                GitHub
                            </span>
                        </button>

                    </div>
                    <p className="text-red-600 text-center text-[16px] my-4">
                        {error && error}
                    </p>
                    <div className="mt-4 text-end text-sm ">

                        <Link href="/register" className="hover:underline ">
                            회원가입
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
