// 생성, 전체 조회
import ExercisePlan from "@/models/ExercisePlan"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"

/**
 * 
 * 사용자의 운동 계획을 가져오는 API
 * @param request 
 * @param param1 
 * @returns 
 */
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
        const exercisePlan = await ExercisePlan.find({ userId: userId });
        return NextResponse.json(exercisePlan, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}