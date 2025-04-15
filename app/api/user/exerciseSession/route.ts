// 생성
import ExerciseSession from "@/models/ExerciseSession"
import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/check-auth"
import ExercisePlan from "@/models/ExercisePlan";


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
            return NextResponse.json({ latestSessionId: null, message: "진행 중인 운동이 없습니다." }, { status: 201 });
        }
        return NextResponse.json({ latestSessionId: latestSession._id, message: "진행 중인 운동이 있습니다." }, { status: 201 });
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
        // 클라이언트에서 전달된 planId를 가져옴
        const { planId } = await req.json();
        console.log("planId", planId); // planId 확인   
        // 사용자 인증 확인
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        // 진행 중인 운동 세션이 있는지 확인
        const latestSession = await ExerciseSession.findOne({
            userId: user._id,
            state: "inProgress",
        })
            .sort({ createdAt: -1 }) // 최신 순으로 정렬
            .populate("exercises.exerciseId"); // 운동 정보 연결

        if (latestSession) {
            return NextResponse.json({ message: "이미 진행 중인 운동이 있습니다." }, { status: 201 });
        }

        // planId로 운동 계획을 찾음

        const plan = await ExercisePlan.findById(planId);
        if (!plan) {
            return NextResponse.json({ message: "운동 계획을 찾을 수 없습니다." }, { status: 404 });
        }

        // 운동 계획에 포함된 운동 데이터를 기반으로 새로운 운동 세션 데이터를 생성
        const sessionData = {
            userId: user._id,
            exercisePlanId: plan._id,
            exercises: plan.exercises.map((exercise: any) => ({
                exerciseId: exercise._id,
                title: exercise.title,
                repTime: exercise.repTime,
                sets: exercise.sets,
                state: "pending", // 초기 상태는 'pending'
                session: [], // 세트 데이터는 빈 배열로 초기화
            })),
            state: "inProgress", // 세션 상태를 'inProgress'로 설정
        };

        // 새로운 운동 세션 생성 및 저장
        const newExerciseSession = new ExerciseSession(sessionData);
        await newExerciseSession.save();

        return NextResponse.json({ newExerciseSession, message: "세션 생성" }, { status: 201 });
    } catch (err: any) {
        console.error("Error creating exercise session:", err);
        return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
    }
};