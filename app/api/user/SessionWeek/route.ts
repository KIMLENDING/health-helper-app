import ExerciseSession from "@/models/ExerciseSession"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"
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
        // 요청에서 사용자 ID 가져오기
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });
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