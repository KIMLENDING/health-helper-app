
import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"




/**
 * 특정 월의 운동 세션을 페이지네이션과 함께 가져오는 API
 * @param req
 */
export const GET = async (req: NextRequest) => {
    try {
        const getSession = await getServerSession();
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!getSession || !token) {
            // 로그인 안되어있으면 로그인 페이지로 이동
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
        }

        // 데이터베이스 연결
        await connect();

        const user = await User.findOne({ email: getSession.user.email, provider: token.provider });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // URL에서 `year`, `month`, `page`, `limit` 가져오기
        const { searchParams } = new URL(req.url);
        const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString()); // 기본값: 올해
        const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString()); // 기본값: 이번 달
        const page = parseInt(searchParams.get("page") || "1"); // 기본값: 1페이지
        const limit = parseInt(searchParams.get("limit") || "10"); // 기본값: 10개씩 가져오기

        const KST_OFFSET = 9 * 60 * 60 * 1000;

        // 선택한 월의 시작 날짜와 끝 날짜 계산
        // 로컬에서 이거 쓰고 
        // const startDate = new Date(year, month - 1, 1); // 해당 월의 첫째 날
        // const endDate = new Date(year, month, 0, 23, 59, 59); // 해당 월의 마지막 날 (23:59:59)

        // 서버에선 이거 쓰고
        const startDate = new Date(new Date(year, month - 1, 1).getTime() - KST_OFFSET);
        const endDate = new Date(new Date(year, month, 0, 23, 59, 59).getTime() - KST_OFFSET);
        // 페이지네이션 적용하여 데이터 가져오기
        const allSession = await ExerciseSession.find({
            userId: user._id,
            createdAt: { $gte: startDate, $lte: endDate } // 해당 월의 데이터만 필터링
        })
            .sort({ createdAt: -1 }) // 최신순 정렬
            .skip((page - 1) * limit) // 페이지네이션 적용
            .limit(limit) // 페이지당 개수 제한
            .populate("exercises.exerciseId", "_id title") // 운동 정보 연결

        // 총 운동 기록 개수 (페이지네이션을 위해 필요)
        const totalCount = await ExerciseSession.countDocuments({
            userId: user._id,
            createdAt: { $gte: startDate, $lte: endDate }
        });

        return NextResponse.json({
            allSession,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit), // 총 페이지 수 계산
            message: "운동 기록 조회 성공"
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exercise session:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
