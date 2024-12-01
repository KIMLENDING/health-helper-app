import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"

/**
 *  운동 세션 id로 조회
 * @param request 
 * @returns 
 */

export const GET = async (request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
    const sessionId = (await params).sessionId; // 요청에서 사용자 ID 가져오기
    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    try {
        await connect();
        const user = await User.findOne({ email: getSession.user.email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const exerciseSession = await ExerciseSession.findOne({ _id: sessionId });
        return NextResponse.json(exerciseSession, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}


export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
    const sessionId = (await params).sessionId; // 요청에서 사용자 ID 가져오기

    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    try {
        await connect();
        const user = await User.findOne({ email: getSession.user.email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const checkSession = await ExerciseSession.findOne({ _id: sessionId });
        if (!checkSession) {
            return NextResponse.json({ message: '존재하지 않는 세션입니다.' }, { status: 404 });
        }
        const allDone: boolean = checkSession.exercises.every((exercise: { state: string }) => exercise.state === 'done');
        if (!allDone) {
            return NextResponse.json({ message: '운동이 모두 완료되지 않았습니다.' }, { status: 400 });
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