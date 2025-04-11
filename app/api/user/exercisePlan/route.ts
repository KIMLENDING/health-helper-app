// 생성, 전체 조회
import ExercisePlan from "@/models/ExercisePlan"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"
import Exercise from "@/models/Exercise";
/**
 * 
 * 사용자의 운동 계획을 가져오는 API
 * @param request 
 * @param param1 
 * @returns 
 */
export const GET = async (req: NextRequest) => {

    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });
        const exercisePlan = await ExercisePlan.find({ userId: user._id });
        return NextResponse.json(exercisePlan, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}

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

        // 각 exerciseId에 대해 title을 가져오기
        const populatedExercises = await Promise.all(
            exercises.map(async (ex: any) => {
                const foundExercise = await Exercise.findById(ex.exerciseId);
                if (!foundExercise) throw new Error(`Exercise not found: ${ex.exerciseId}`);
                return {
                    ...ex,
                    title: foundExercise.title, // 여기에 운동 이름 삽입
                };
            })
        );

        const newExercisePlan = new ExercisePlan({
            userId: user._id,
            title,
            exercises: populatedExercises,
        });

        await newExercisePlan.save();

        return NextResponse.json({ message: '플랜 추가 성공' }, { status: 201 });
    } catch (err: any) {
        console.error("❌ [POST /api/user/exercisePlan] error:", err);
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
};
/**
 *  운동 계획 수정 API
 *  type이 수정 이면 exercise에서 rest, sets, reps 수정
 *  type이 추가 이면 exercise 추가
 * @param req
 * @returns 
 */

export const PATCH = async (req: NextRequest) => {
    try {
        const { userId, exercisePlanId, exercises, type } = await req.json();

        // 요청에서 사용자 ID 가져오기
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        if (user._id.toString() !== userId) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
        }

        // ExercisePlan 찾기
        const exercisePlan = await ExercisePlan.findOne({ _id: exercisePlanId });

        if (!exercisePlan) {
            return NextResponse.json({ message: 'Exercise Plan not found' }, { status: 404 });
        }

        if (type === 'add') {
            // Exercise 추가
            // 기존 운동 ID 가져오기
            const existingExerciseIds = exercisePlan.exercises.map((ex: any) => ex.exerciseId.toString());
            // 기존 운동 ID와 새로운 운동 ID 비교 해서 중복 제거
            const newExercises = exercises.filter((ex: any) => !existingExerciseIds.includes(ex.exerciseId));
            if (newExercises.length === 0) {
                // console.log('이미 존재하는 운동입니다.');
                return NextResponse.json({ message: '이미 존재하는 운동입니다.' }, { status: 400 });
            }
            // 운동 추가
            exercisePlan.exercises.push(...newExercises);
            await exercisePlan.save();
            return NextResponse.json({ message: '운동 추가 성공', updatedExercise: newExercises }, { status: 200 });
        }
        if (type === 'edit') {
            // Exercise 업데이트
            const exerciseIndex = exercisePlan.exercises.findIndex(
                (ex: any) => ex.exerciseId.toString() === exercises[0].exerciseId);

            if (exerciseIndex === -1) {
                return NextResponse.json({ message: 'Exercise not found' }, { status: 404 });
            }

            // 데이터 수정
            exercisePlan.exercises[exerciseIndex] = { ...exercisePlan.exercises[exerciseIndex], ...exercises[0] };

            // 변경 내용 저장
            await exercisePlan.save();

            return NextResponse.json({ message: '운동 수정 성공', updatedExercise: exercisePlan.exercises[exerciseIndex] }, { status: 200 });
        }

    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
};

