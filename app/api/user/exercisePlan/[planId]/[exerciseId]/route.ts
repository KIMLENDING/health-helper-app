import ExercisePlan from "@/models/ExercisePlan"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import { ExerciseOption } from "@/utils/util"
/**
 *  운동 계획의 선택한 운동항목 삭제 API
 * @param request 
 * @returns 
 */

export const DELETE = async (request: Request, { params }: { params: Promise<{ planId: string, exerciseId: string }> }) => {
    try {
        const exercisePlanId = (await params).planId; // 요청에서 exercisePlanId 가져오기
        const exerciseId = (await params).exerciseId; // 요청에서 exerciseId 가져오기

        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { message: "로그인 해주세요." },
                { status: 401 }
            );
        }

        await connect(); // MongoDB 연결

        // 해당 유저 확인
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "유저를 찾을 수 없습니다." }, { status: 404 });
        }


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
    } catch (error: any) {
        return NextResponse.json(
            { message: "서버 에러 발생", error: error.message },
            { status: 500 }
        );
    }
};
