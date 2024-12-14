// 생성
import ExerciseSession from "@/models/ExerciseSession"

import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"



/**
 *  isProgress 상태인 가장 최근의 운동 세션을 가져오는 API
 * @param request 
 */
export const GET = async (request: NextRequest) => {
    try {
        const session = await getServerSession();
        if (!session) {
            // 로그인하지 않았으면 로그인 페이지로 리다이렉트
            return NextResponse.redirect("http://localhost:3000/login");
        }

        // 데이터베이스 연결
        await connect();

        // 로그인한 사용자의 정보를 찾음
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 사용자 ID와 일치하며 state가 'inProgress'인 가장 최근의 데이터를 찾음
        const latestSession = await ExerciseSession.findOne({
            userId: user._id,
            state: "inProgress",
        })
            .sort({ createdAt: -1 })
            .populate("exercises.exerciseId"); // populate로 Exercise 정보 가져오기

        // 디버깅용 로그 추가
        // console.log("가장 최근 운동 세션:", latestSession);
        if (!latestSession) {
            return NextResponse.json({ message: "진행 중인 운동이 없습니다." }, { status: 201 });
        }

        return NextResponse.json({ latestSession, message: "현재 진행 중인 운동이 있습니다." }, { status: 201 });
    } catch (error) {
        console.error("Error fetching exercise session:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

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

    if (user._id.toString() !== sessionData.userId.toString()) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }
    // console.log(user._id)
    // 사용자 ID와 일치하며 state가 'inProgress'인 가장 최근의 데이터를 찾음
    const latestSession = await ExerciseSession.findOne({
        userId: user._id,
        state: "inProgress",
    })
        .sort({ createdAt: -1 }) // 최신 순으로 정렬
        .populate("exercises.exerciseId"); // 운동 정보 연결 populate를 첨 알 았음  findOne()으로 찾은 데이터에 연결된 데이터를 가져올 때 사용
    // console.log(latestSession)
    if (latestSession) {
        return NextResponse.json({ message: "이미 진행 중인 운동이 있습니다." }, { status: 201 });
    }

    const newExerciseSession = new ExerciseSession(sessionData);

    try {
        await newExerciseSession.save();
        return NextResponse.json({ newExerciseSession, message: '세션 생성' }, { status: 201 });
    } catch (err: any) {

        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}