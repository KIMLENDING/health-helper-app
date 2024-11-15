// 생성, 전체 조회
import ExercisePlan from "@/models/ExercisePlan"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"

export const POST = async (request: NextRequest) => {
    // 운동 추가
    // 요청에서 사용자 ID 가져오기

    const { title, exercises, userId } = await request.json();
    console.log('title', title);
    console.log('exercises', exercises);
    console.log('userId', userId);
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
    console.log('ss', existTitle);
    if (existTitle) {
        return NextResponse.json({ message: '이미 추가된 플랜입니다.' }, { status: 400 });
    }
    const newExercisePlan = new ExercisePlan({
        userId: userId,
        title,
        exercises,
    });
    console.log('newExercisePlan', newExercisePlan);
    try {
        await newExercisePlan.save();
        return NextResponse.json({ message: '플랜 추가 성공' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}
export const GET = async (request: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
    const userId = (await params).userId; // 요청에서 사용자 ID 가져오기
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
        if (user._id.toString() !== userId) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
        }
        const exercises = await ExercisePlan.find({ userId: userId });
        return NextResponse.json(exercises);
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}