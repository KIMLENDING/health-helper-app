import ExerciseSession from "@/models/ExerciseSession"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"

/**
 *  운동 세션 id로 조회
 * @param request 
 * @returns 
 */

export const GET = async (req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) => {
    const sessionId = (await params).sessionId; // 요청에서 사용자 ID 가져오기
    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        const exerciseSession = await ExerciseSession.findOne({ _id: sessionId });
        return NextResponse.json(exerciseSession, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}


export const PATCH = async (req: NextRequest) => {
    const { sessionId } = await req.json(); // 요청에서 사용자 ID 가져오기
    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });


        const checkSession = await ExerciseSession.findOne({ _id: sessionId });
        if (!checkSession) {
            return NextResponse.json({ message: '존재하지 않는 세션입니다.' }, { status: 404 });
        }
        const allDone: boolean = checkSession.exercises.every((exercise: { state: string }) => exercise.state !== 'done');
        if (allDone) {
            // 완료한 운동이 하나라도 없으면 세션 삭제
            await ExerciseSession.deleteOne({ _id: sessionId });
            return NextResponse.json({ delete: true, message: '완료한 운동이 없어 제거했습니다.' }, { status: 201 });
        }
        // 완료하지 않은 운동 필드는 제거 
        checkSession.exercises = checkSession.exercises.filter((exercise: { state: string }) => exercise.state === 'done');
        // 세션 상태 업데이트
        checkSession.state = 'done';
        checkSession.markModified("exercises");
        await checkSession.save();

        // const updatedSession = await ExerciseSession.findOneAndUpdate(
        //     { _id: sessionId, },// 조건
        //     {
        //         $set: { 'state': 'done', },  // 업데이트할 필드
        //     },
        // );
        return NextResponse.json({ updatedSession: checkSession, message: '서버에 저장되었습니다.' }, { status: 201 });
    }
    catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}