// 개별 삭제 조회
import ExercisePlan from "@/models/ExercisePlan"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"


/**
 * 플랜 ID에 해당하는 운동 계획을 가져오는 API
 * @param req 
 * @param param1 플랜ID 
 * @returns 
 */
export const GET = async (req: NextRequest, { params }: { params: Promise<{ planId: string }> }) => {
    const planId = (await params).planId; // 요청에서  ID 가져오기
    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });
        const exercisePlan = await ExercisePlan.findOne({ _id: planId }).populate('exercises.exerciseId', 'title tags description');

        return NextResponse.json(exercisePlan, { status: 200 });
    } catch (err: any) {
        console.error(" [GET /api/user/exercisePlan/[planId]] error:", err);
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}

/** 개별 운동 수정(세트,횟수,무게) */
export async function PATCH(request: NextRequest) {
    try {
        // 인증 확인
        const { user, error, status } = await requireUser(request);
        if (error || !user) {
            return NextResponse.json({ message: error || '인증되지 않은 요청입니다.' }, { status: status || 401 });
        }

        // 요청 본문 파싱
        const { exercisePlanId, title, exercises } = await request.json();

        // 업데이트할 운동 계획이 사용자의 것인지 확인
        const plan = await ExercisePlan.findOne({
            _id: exercisePlanId,
            userId: user._id
        });

        if (!plan) {
            return NextResponse.json({ message: '운동 계획을 찾을 수 없거나 접근 권한이 없습니다.' }, { status: 404 });
        }

        // 업데이트 준비
        const updateData: any = {};

        if (title) {
            updateData.title = title;
        }

        if (exercises && Array.isArray(exercises)) {
            // 요청된 운동만 필터링하여 저장
            const updatedExercises = exercises.map((updatedExercise: any) => {
                const existingExercise = plan.exercises.find((ex: any) =>
                    ex._id.toString() === updatedExercise._id
                );

                if (existingExercise) {
                    return {
                        ...existingExercise.toObject(), // 기존 운동 정보 유지
                        sets: updatedExercise.sets || existingExercise.sets,
                        reps: updatedExercise.reps || existingExercise.reps,
                        weight: updatedExercise.weight || existingExercise.weight
                    };
                }
                return null; // 존재하지 않는 운동은 제외
            }).filter((exercise: any) => exercise !== null);

            updateData.exercises = updatedExercises;
        }

        // 업데이트 실행
        const result = await ExercisePlan.findByIdAndUpdate(
            exercisePlanId,
            { $set: updateData },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ message: '업데이트할 운동 계획을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json({
            message: '운동 계획이 성공적으로 업데이트되었습니다.',
            data: result
        }, { status: 200 });
    } catch (err: any) {
        console.error(" [PATCH /api/user/exercisePlan/[planId]] error:", err);
        return NextResponse.json({ message: `오류가 발생했습니다: ${err.message}` }, { status: 500 });
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
        console.error(" [DELETE /api/user/exercisePlan/[planId]] error:", err);
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}