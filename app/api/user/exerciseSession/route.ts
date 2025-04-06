// 생성
import ExerciseSession from "@/models/ExerciseSession"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"


/**
 *  isProgress 상태인 가장 최근의 운동 세션을 가져오는 API
 * @param req
 */
export const GET = async (req: NextRequest) => {
    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });
        // 사용자 ID와 일치하며 state가 'inProgress'인 가장 최근의 데이터를 찾음
        const latestSession = await ExerciseSession.findOne({
            userId: user._id,
            state: "inProgress",
        })
            .sort({ createdAt: -1 })
            .populate("exercises.exerciseId"); // populate로 Exercise 정보 가져오기

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
 * @param req 
 * @returns 
 */
export const POST = async (req: NextRequest) => {
    try {
        const sessionData = await req.json();

        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        if (user._id.toString() !== sessionData.userId.toString()) {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
        }
        const latestSession = await ExerciseSession.findOne({
            userId: user._id,
            state: "inProgress",
        })
            .sort({ createdAt: -1 }) // 최신 순으로 정렬
            .populate("exercises.exerciseId"); // 운동 정보 연결 populate를 첨 알 았음  findOne()으로 찾은 데이터에 연결된 데이터를 가져올 때 사용

        if (latestSession) {
            return NextResponse.json({ message: "이미 진행 중인 운동이 있습니다." }, { status: 201 });
        }

        const newExerciseSession = new ExerciseSession(sessionData);

        await newExerciseSession.save();
        return NextResponse.json({ newExerciseSession, message: '세션 생성' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}