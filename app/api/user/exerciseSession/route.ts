// 생성
import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"

/**
 *  초기 운동 세션 생성
 * @param request 
 * @returns 
 */
export const POST = async (request: NextRequest) => {
    const sessionData = await request.json();

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
    console.log(sessionData)
    if (user._id.toString() !== sessionData.userId.toString()) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    const newExerciseSession = new ExerciseSession(sessionData);

    try {
        await newExerciseSession.save();
        return NextResponse.json({ newExerciseSession, message: '세션 생성' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}