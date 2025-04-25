import ExercisePlan from "@/models/ExercisePlan"
import { NextRequest, NextResponse } from "next/server"
import { ExerciseOption } from "@/utils/util"
import { requireUser } from "@/lib/check-auth"
/**
 *  운동 계획의 선택한 운동항목 삭제 API
 * @param req
 * @returns 
 */

export const DELETE = async (req: NextRequest) => {

    try {
        const { exercisePlanId, exerciseId } = await req.json(); // 요청 본문에서 exercisePlanId와 exerciseId 가져오기

        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        // ExercisePlan 찾기
        const exercisePlan = await ExercisePlan.findOne({ _id: exercisePlanId, userId: user._id });
        if (!exercisePlan) {
            return NextResponse.json({ message: "플랜을 찾을 수 없습니다." }, { status: 404 });
        }

        // 삭제할 exercise가 있는지 확인
        const exerciseExists = exercisePlan.exercises.some(
            (exercise: ExerciseOption) => exercise._id!.toString() === exerciseId
        );
        if (!exerciseExists) {
            return NextResponse.json({ message: "운동 항목을 찾을 수 없습니다." }, { status: 404 });
        }

        // 운동 삭제
        const updatedPlan = await ExercisePlan.updateOne(
            { _id: exercisePlanId },
            { $pull: { exercises: { _id: exerciseId } } } // 특정 _id인 요소 삭제
        );

        if (updatedPlan.modifiedCount === 0) {
            return NextResponse.json(
                { message: "삭제 실패, 다시 시도해주세요." },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "운동 삭제 성공!" }, { status: 200 });
    } catch (err: any) {
        console.error(" [DELETE /api/user/exercisePlan/[planId]/[exerciseId]] error:", err);
        return NextResponse.json(
            { message: "서버 에러 발생", error: err.message },
            { status: 500 }
        );
    }
};
