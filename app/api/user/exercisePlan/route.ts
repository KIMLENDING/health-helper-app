// 생성, 전체 조회
import ExercisePlan from "@/models/ExercisePlan"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"

/**
 * 
 * 사용자의 운동 계획들을 가져오는 API
 * @param request 
 * @param param1 
 * @returns 
 */
export const GET = async (req: NextRequest) => {
    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        // 필요한 필드만 선택하여 가져오기 .select('_id userId title')
        const exercisePlan = await ExercisePlan.find({ userId: user._id })
            .populate('exercises.exerciseId', 'title');

        return NextResponse.json(exercisePlan, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
};

/**
 *  운동 계획 추가
 * @param req 
 * @returns 
 */
export const POST = async (req: NextRequest) => {
    const { title, exercises } = await req.json();

    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        const existTitle = await ExercisePlan.findOne({ title: title, userId: user._id });
        if (existTitle) {
            return NextResponse.json({ message: '플랜 이름 중복' }, { status: 400 });
        }

        const newExercisePlan = new ExercisePlan({
            userId: user._id,
            title,
            exercises: exercises,
        });

        await newExercisePlan.save();

        return NextResponse.json({ message: '플랜 추가 성공' }, { status: 201 });
    } catch (err: any) {
        console.error(" [POST /api/user/exercisePlan] error:", err);
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
};


/**
 *  운동 계획에 운동 추가 API
 * @param req
 * @returns 
 */

export const PATCH = async (req: NextRequest) => {
    try {
        const { exercisePlanId, exercises } = await req.json();
        // 요청에서 사용자 ID 가져오기
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        // ExercisePlan 찾기
        const exercisePlan = await ExercisePlan.findOne({ _id: exercisePlanId }).populate("exercises.exerciseId");

        if (!exercisePlan) {
            return NextResponse.json({ message: 'Exercise Plan not found' }, { status: 404 });
        }

        // 운동 추가
        exercisePlan.exercises.push(...exercises);
        await exercisePlan.save();
        return NextResponse.json({ message: '운동 추가 성공', data: exercisePlan }, { status: 200 });

    } catch (err: any) {
        console.error(" [PATCH /api/user/exercisePlan] error:", err);
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
};

/** 플랜 제거 */
export const DELETE = async (req: NextRequest) => {
    try {
        const { exercisePlanId } = await req.json();
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        // 운동 계획 삭제
        const deletedExercisePlan = await ExercisePlan.findOneAndDelete({ _id: exercisePlanId, userId: user._id });
        if (!deletedExercisePlan) {
            return NextResponse.json({ message: '운동 계획을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json({ message: '운동 계획 삭제 성공' }, { status: 200 });
    } catch (err: any) {
        console.error(" [DELETE /api/user/exercisePlan] error:", err);
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}