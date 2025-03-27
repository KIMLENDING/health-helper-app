// 개별 삭제 조회
import ExercisePlan from "@/models/ExercisePlan"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"


export const GET = async (req: NextRequest, { params }: { params: Promise<{ planId: string }> }) => {
    const planId = (await params).planId; // 요청에서 사용자 ID 가져오기
    const getSession = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!getSession || !token) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    try {
        await connect();
        const user = await User.findOne({ email: getSession.user.email, provider: token.provider });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const exercisePlan = await ExercisePlan.findOne({ _id: planId });
        return NextResponse.json(exercisePlan, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ planId: string }> }) => {
    const planId = (await params).planId; // 요청에서 플랜 ID 가져오기
    const title = await req.json();
    const getSession = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!getSession || !token) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    try {
        await connect();
        const user = await User.findOne({ email: getSession.user.email, provider: token.provider });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        // console.log(title);
        const updatedPlan = await ExercisePlan.findOneAndUpdate(
            { _id: planId }, { $set: { title } }, { new: true });
        // console.log(updatedPlan);
        if (!updatedPlan) {
            return NextResponse.json({ message: '수정할 플랜이 존재하지 않습니다.' }, { status: 404 });
        }
        return NextResponse.json({ updatedPlan, message: '제목 수정 완료' }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ planId: string }> }) => {
    const planId = (await params).planId; // 요청에서 플랜 ID 가져오기
    const getSession = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!getSession || !token) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    try {
        await connect();
        const user = await User.findOne({ email: getSession.user.email, provider: token.provider });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const exercisePlan = await ExercisePlan.findOneAndDelete({ _id: planId });
        return NextResponse.json({ exercisePlan, message: '삭제 성공' }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}