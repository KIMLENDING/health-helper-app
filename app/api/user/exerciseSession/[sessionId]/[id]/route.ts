// 생성
import ExerciseSession from "@/models/ExerciseSession"
import { NextRequest, NextResponse } from "next/server"
import ExercisePlan from "@/models/ExercisePlan"
import { requireUser } from "@/lib/check-auth"

/**
 *  운동 시작시 상태를 변경하는 API
 * @param req
 * @returns 
 */
export const POST = async (req: NextRequest) => {
    const { sessionId, exerciseId, action } = await req.json();

    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        const exerciseSession = await ExerciseSession.findOne({ _id: sessionId, userId: user._id });
        if (!exerciseSession) {
            return NextResponse.json({ message: "Exercise session not found" }, { status: 404 });
        }

        const exercise = exerciseSession.exercises.find((e: any) => e._id.toString() === exerciseId);
        if (!exercise) {
            return NextResponse.json({ message: "Exercise not found" }, { status: 404 });
        }

        if (
            action === "start" &&
            exercise.session.length >= exercise.sets &&
            exercise.state !== "done"
        ) {
            // 세트 수가 채워진 경우 자동으로 done 처리
            const startTime = new Date(exercise.session[0].createdAt).getTime();
            const endTime = new Date().getTime();
            const repTime = Math.floor((endTime - startTime) / 1000);

            exercise.state = "done";
            exercise.repTime = repTime;
            // 변경 감지
            exerciseSession.markModified("exercises");
            await exerciseSession.save();
            return NextResponse.json({ message: "done", exerciseSession }, { status: 200 });
        }


        if (action === "start") {
            // state가 pending이면 inProgress로 변경

            if (exercise.state === "pending") {
                exercise.state = "inProgress";
            }

            const sessionLength = exercise.session.length;
            if (sessionLength === 0) {
                // 초기 세트 생성 → ExercisePlan 참조
                const plan = await ExercisePlan.findById(exerciseSession.exercisePlanId);
                const planExercise = plan.exercises.find(
                    (e: any) => e.exerciseId.toString() === exercise.exerciseId.toString()
                );

                if (!planExercise) {
                    return NextResponse.json({ message: "Exercise plan not found" }, { status: 404 });
                }

                exercise.session.push({
                    set: 1,
                    reps: planExercise.reps,
                    weight: planExercise.weight || 40,
                });
                // 변경 감지
                exerciseSession.markModified("exercises");
                await exerciseSession.save();
                return NextResponse.json({ message: "first", exerciseSession }, { status: 200 });
            } else {
                // 이전 세트 참고해서 세트 추가
                const prev = exercise.session[sessionLength - 1];
                exercise.session.push({
                    set: prev.set + 1,
                    reps: prev.reps,
                    weight: prev.weight + 5,
                });
                // 변경 감지
                exerciseSession.markModified("exercises");
                await exerciseSession.save();
                return NextResponse.json({ message: "Updated", exerciseSession }, { status: 200 });
            }

        }

        if (action === "done") {
            // 자동 repTime 계산
            if (exercise.session.length === 0) {
                return NextResponse.json({ message: "No session data found" }, { status: 400 });
            }

            const startTime = new Date(exercise.session[0].createdAt).getTime();
            const endTime = new Date().getTime();
            const repTime = Math.floor((endTime - startTime) / 1000); // 초 단위

            exercise.state = "done";
            exercise.repTime = repTime;
            // 변경 감지
            exerciseSession.markModified("exercises");
            await exerciseSession.save();
            return NextResponse.json({ message: "done", exerciseSession }, { status: 200 });
        }

    } catch (err: any) {
        return NextResponse.json(
            { message: "Internal Server Error", error: err.message },
            { status: 500 }
        );
    }
};



export const PATCH = async (req: NextRequest) => {
    const { sessionId, exerciseId, setId, reps, weight } = await req.json();
    try {
        const { user, error, status } = await requireUser(req);
        if (!user) return NextResponse.json({ message: error }, { status });

        const updatedSession = await ExerciseSession.findOneAndUpdate(
            { _id: sessionId, "exercises._id": exerciseId, "exercises.session._id": setId },// 조건
            {
                $set: {
                    'exercises.$[exercise].session.$[session].reps': reps,
                    'exercises.$[exercise].session.$[session].weight': weight
                },  // 업데이트할 필드
            },
            {
                new: true,
                arrayFilters: [
                    { "exercise._id": exerciseId },
                    { "session._id": setId }
                ]
            } // 업데이트 후 새로운 문서를 반환
        );
        if (!updatedSession) {
            return NextResponse.json(
                { error: "Exercise session or exercise not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ updatedSession, message: '횟수 및 중량 수정 완료' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
};
