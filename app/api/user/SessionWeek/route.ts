import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"
function getWeekRange() {
    const today = new Date(); // 오늘 날짜 (한국 시간 기준)
    const utc = today.getTime() + (today.getTimezoneOffset() * 60 * 1000); //해당지역 시간 + 보정값(utc-지역시간) =  UTC 기준 시간
    const koreaTimeDiff = 9 * 60 * 60 * 1000; // 한국 시간과 UTC 시간의 차이
    const koreaTime = new Date(utc + koreaTimeDiff); // 한국 시간

    const sunday = new Date(koreaTime);
    sunday.setDate(sunday.getDate() - sunday.getDay()); // 일요일 날짜 구하기
    sunday.setHours(0, 0, 0, 0);


    // 토요일 23:59:59 계산
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    return { sunday, saturday };
}




export const GET = async (req: NextRequest) => {
    try {
        const cookieHeader = req.cookies.get("next-auth.session-token");
        const cookie = req.cookies.get("__Secure-next-auth.session-token");
        if (!cookieHeader || !cookie) {
            // 쿠키가 없으면 로그인 페이지로 이동
            console.log("쿠키가 없습니다.");
            // return NextResponse.json({ message: "쿠키가 없습니다." }, { status: 401 });
        }
        console.log("🔍 서버에서 받은 쿠키:", cookieHeader);
        console.log("🔍 서버에서 받은 쿠키:", cookie);
        const getSession = await getServerSession();
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        console.log(getSession, token);
        if (!getSession || !token) {
            // 로그인 안되어있으면 로그인 페이지로 이동
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
        }

        await connect();

        const user = await User.findOne({ email: getSession.user.email, provider: token.provider });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const { sunday, saturday } = getWeekRange();
        const sessions = await ExerciseSession.find({
            userId: user._id,
            createdAt: { $gte: sunday, $lte: saturday },
        }).sort({ createdAt: 1 }).populate("exercises.exerciseId"); // 해당 주간 데이터 조회 populate를 통해 exerciseId를 통해 운동 데이터를 가져옵니다.
        if (!sessions) {
            return NextResponse.json({ message: "주간 데이터가 없습니다." }, { status: 200 });
        }
        return NextResponse.json({ sessions, sunday, message: "주간 데이터" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exercise session:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}