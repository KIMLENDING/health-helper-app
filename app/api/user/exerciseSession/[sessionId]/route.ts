import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"

/**
 *  운동 세션 id로 조회
 * @param request 
 * @returns 
 */

export const GET = async (req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
    const sessionId = (await params).sessionId; // 요청에서 사용자 ID 가져오기
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
        const exerciseSession = await ExerciseSession.findOne({ _id: sessionId });
        return NextResponse.json(exerciseSession, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}


export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
    const sessionId = (await params).sessionId; // 요청에서 사용자 ID 가져오기

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
        const checkSession = await ExerciseSession.findOne({ _id: sessionId });
        if (!checkSession) {
            return NextResponse.json({ message: '존재하지 않는 세션입니다.' }, { status: 404 });
        }
        const allDone: boolean = checkSession.exercises.every((exercise: { state: string }) => exercise.state !== 'done');
        if (allDone) {
            // 모든 운동이 완료되지 않았을 땐 해당 세션을 제거해버리기
            await ExerciseSession.deleteOne({ _id: sessionId });
            return NextResponse.json({ delete: true, message: '완료한 운동이 없어 제거했습니다.' }, { status: 201 });
        }
        const updatedSession = await ExerciseSession.findOneAndUpdate(
            { _id: sessionId, },// 조건
            {
                $set: { 'state': 'done', },  // 업데이트할 필드
            },
            { new: true } // 업데이트 후 새로운 문서를 반환
        );
        if (!updatedSession) {
            return NextResponse.json(
                { error: "Exercise session or exercise not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ updatedSession, message: '서버에 저장되었습니다.' }, { status: 201 });

    }
    catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }

}