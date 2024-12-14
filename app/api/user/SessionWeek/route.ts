import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
function getWeekRange() {
    const today = new Date(new Date()); // 오늘 날짜 (한국 시간 기준)
    const sunday = new Date(today);
    sunday.setDate(sunday.getDate() - sunday.getDay()); // 일요일 날짜 구하기
    sunday.setHours(0, 0, 0, 0);

    console.log(sunday)

    // 토요일 23:59:59 계산
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    return { sunday, saturday };
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
        const { sunday, saturday } = getWeekRange();
        const sessions = await ExerciseSession.find({
            userId: user._id,
            createdAt: { $gte: sunday, $lte: saturday },
        }).sort({ createdAt: 1 });
        if (!sessions) {
            return NextResponse.json({ message: "주간 데이터가 없습니다." }, { status: 200 });
        }
        return NextResponse.json({ sessions, sunday, message: "주간 데이터" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exercise session:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}