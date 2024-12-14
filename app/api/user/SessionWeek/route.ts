import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
function getWeekRange() {
    const today = new Date(new Date()); // 오늘 날짜 (한국 시간 기준)
    const dayOfWeek = today.getDay(); // 요일 (0: 일요일 ~ 6: 토요일)
    // 일요일 00:00:00 계산
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    console.log(startOfWeek)

    // 토요일 23:59:59 계산
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}




export const GET = async (request: NextRequest) => {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.redirect("http://localhost:3000/login");
        }

        await connect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const { startOfWeek, endOfWeek } = getWeekRange();
        const sessions = await ExerciseSession.find({
            userId: user._id,
            createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        }).sort({ createdAt: 1 });
        if (!sessions) {
            return NextResponse.json({ message: "주간 데이터가 없습니다." }, { status: 200 });
        }
        return NextResponse.json({ sessions, startOfWeek, message: "주간 데이터" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exercise session:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}