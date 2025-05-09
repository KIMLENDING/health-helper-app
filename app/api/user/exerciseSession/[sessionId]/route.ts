import ExerciseSession from "@/models/ExerciseSession"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"
import ExercisePlan from "@/models/ExercisePlan";

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

        const exerciseSession = await ExerciseSession.findOne({ _id: sessionId }).populate('exercises.exerciseId', 'title');
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


        const checkSession = await ExerciseSession.findOne({ _id: sessionId }).populate('exercises.exerciseId', 'title');
        if (!checkSession) {
            return NextResponse.json({ message: '존재하지 않는 세션입니다.' }, { status: 404 });
        }
        const planId = checkSession.exercisePlanId;
        console.log('planId', planId);

        // 완료되지 않은 운동이 있는지 확인
        checkSession.exercises.forEach((exercise: any) => {
            const sessionLength = exercise.session.length;
            if (sessionLength > 0) {
                const currentSet = exercise.session[sessionLength - 1];
                currentSet.endTime = new Date();
                exercise.state = "done";
            }
        })
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
        const a = await ExercisePlan.findOneAndUpdate(
            { _id: planId },
            { $set: { lastPlayed: new Date() } },
            { new: true, strict: false }
        );
        if (!a) {
            return NextResponse.json({ message: '운동 계획을 찾을 수 없습니다.' }, { status: 404 });
        }
        return NextResponse.json({ updatedSession: checkSession, message: '서버에 저장되었습니다.' }, { status: 201 });
    }
    catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}