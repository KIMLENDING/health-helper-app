"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
;
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";


const Register = ({ fetchUrl }: { fetchUrl?: string }) => {
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession(); // 

    useEffect(() => {
        if (sessionStatus === "authenticated") {  // 로그인 상태일 때
            router.replace("/dashboard");
        }
    }, [sessionStatus, router]);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        const confirmPassword = e.target[2].value;
        console.log(email, password, confirmPassword);
        if (!isValidEmail(email)) {
            setError("이메일 형식이 유효하지 않습니다.");
            toast({ variant: "destructive", title: "이메일 형식이 유효하지 않습니다." })
            return;
        }

        if (!password || password.length < 8) {
            setError("비밀번호가 8자 이상이어야 합니다.");
            toast({ variant: "destructive", title: "비밀번호가 8자 이상이어야 합니다." })
            return;
        }

        if (confirmPassword !== password) {
            setError("패스워드가 일치하지 않습니다.");
            toast({ variant: "destructive", title: "패스워드가 일치하지 않습니다." })
            return;
        }

        try {
            const newfetchUrl = fetchUrl || '/api/register';
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
            const res = await fetch(fetchUrl || `${baseUrl}${newfetchUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            if (res.status === 400) {
                toast({ variant: "destructive", title: "이 이메일은 이미 사용중입니다." })

                setError("이 이메일은 이미 사용중입니다.");
            }
            if (res.status === 200) {
                setError("");
                toast({ variant: "destructive", title: "회원가입이 완료되었습니다." })

                router.push("/login");
            }
        } catch (error) {
            toast({ variant: "destructive", title: "에러가 발생했습니다. 다시 시도해주세요." })
            setError("에러가 발생했습니다. 다시 시도해주세요.");
            console.log(error);
        }
    };

    if (sessionStatus === "loading") {
        return <h1>Loading...</h1>;
    }
    return (
        sessionStatus !== "authenticated" && (


            <div className="flex h-screen w-full items-center justify-center px-4 ">
                <Card className="mx-auto max-w-sm  ">
                    <CardHeader>
                        <CardTitle className="text-2xl dark:text-white">{fetchUrl && '관리자 '}계정 생성</CardTitle>
                        <CardDescription >
                            계정을 생성하려면 아래에 이메일을 입력하세요
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
                                    </div>
                                    <Input id="password" type="password" placeholder="비밀번호" autoComplete="current-password" required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password" >비밀번호 확인</Label>
                                    </div>
                                    <Input id="password" type="password" placeholder="비밀번호 확인" autoComplete="current-password" required />
                                </div>
                                <Button type="submit" className="w-full ">
                                    회원가입
                                </Button>
                            </div>
                        </form>

                        <p className="text-red-600 text-center text-[16px] my-4">
                            {error && error}
                        </p>
                        <div className="mt-4 text-end text-sm ">

                            <Link href="/login" className="hover:underline ">
                                로그인으로 이동
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>


        )
    );
};

export default Register;
