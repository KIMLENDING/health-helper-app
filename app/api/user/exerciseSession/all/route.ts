
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
        const allSession = await ExerciseSession.find({
            userId: user._id,
        })
            .sort({ createdAt: -1 })
            .populate("exercises.exerciseId"); // populate로 Exercise 정보 가져오기

        if (!allSession) {
            return NextResponse.json({ message: "운동 기록이 없습니다." }, { status: 200 });
        }

        return NextResponse.json({ allSession, message: "운동 기록" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exercise session:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}