import { NextRequest, NextResponse } from "next/server";


import mongoose from "mongoose";
import { requireUser } from "@/lib/check-auth";
import ExercisePlan from "@/models/ExercisePlan";
import ExerciseSession from "@/models/ExerciseSession";
import User from "@/models/User";

export const DELETE = async (req: NextRequest) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // 트랜잭션 시작

    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        // 유저가 생성한 모든 ExercisePlan 조회
        const exercisePlans = await ExercisePlan.find({ userId: user._id }).session(session);

        // ExercisePlan에 연결된 모든 ExerciseSession 삭제
        await ExerciseSession.deleteMany({
            exercisePlanId: { $in: exercisePlans.map(plan => plan._id) }, // 해당 ExercisePlan에 연결된 모든 ExerciseSession 삭제
        }).session(session);

        // 유저가 생성한 ExercisePlan 삭제
        await ExercisePlan.deleteMany({ userId: user._id }).session(session);

        // 유저 삭제
        await User.findByIdAndDelete(user._id).session(session);

        // 트랜잭션 커밋
        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ message: "계정 삭제를 완료했습니다." }, { status: 200 });
    } catch (err: any) {
        // 트랜잭션 롤백
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
    }
};
