// 생성, 전체 조회
import ExercisePlan from "@/models/ExercisePlan"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"


/**
 *  운동 계획 추가
 * @param request 
 * @returns 
 */
export const POST = async (request: NextRequest) => {
    // 운동 추가
    // 요청에서 사용자 ID 가져오기
    // console.log('post요청')
    const { title, exercises, userId } = await request.json();

    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    await connect();

    const user = await User.findOne({ email: getSession.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (user._id.toString() !== userId) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }
    const existTitle = await ExercisePlan.findOne({ title: title, userId: userId });

    if (existTitle) {
        return NextResponse.json({ message: '플랜 이름 중복' }, { status: 400 });
    }
    const newExercisePlan = new ExercisePlan({
        userId: userId,
        title,
        exercises,
    });
    // console.log('newExercisePlan', newExercisePlan);
    try {
        await newExercisePlan.save();
        return NextResponse.json({ message: '플랜 추가 성공' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}
/**
 *  운동 계획 수정 API
 *  type이 수정 이면 exercise에서 rest, sets, reps 수정
 *  type이 추가 이면 exercise 추가
 * @param request 
 * @returns 
 */

export const PATCH = async (request: NextRequest) => {
    try {
        const { userId, exercisePlanId, exercises, type } = await request.json();

        // console.log(type)
        const getSession = await getServerSession();
        if (!getSession) {
            // 로그인 안되어있으면 로그인 페이지로 이동
            return NextResponse.redirect('http://localhost:3000/login');
        }

        await connect();

        // 로그인된 사용자가 요청 사용자와 일치하는지 확인
        const user = await User.findOne({ email: getSession.user.email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
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

