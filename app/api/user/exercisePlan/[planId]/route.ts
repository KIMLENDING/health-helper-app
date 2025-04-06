// 개별 삭제 조회
import ExercisePlan from "@/models/ExercisePlan"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"
import { requireUser } from "@/lib/check-auth"


export const GET = async (req: NextRequest, { params }: { params: Promise<{ planId: string }> }) => {
    const planId = (await params).planId; // 요청에서 사용자 ID 가져오기

    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });
        const exercisePlan = await ExercisePlan.findOne({ _id: planId });
        return NextResponse.json(exercisePlan, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ planId: string }> }) => {
    const planId = (await params).planId; // 요청에서 플랜 ID 가져오기
    const title = await req.json();

    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        const updatedPlan = await ExercisePlan.findOneAndUpdate(
            { _id: planId }, { $set: { title } }, { new: true });

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



    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });
        const exercisePlan = await ExercisePlan.findOneAndDelete({ _id: planId });
        return NextResponse.json({ exercisePlan, message: '삭제 성공' }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}