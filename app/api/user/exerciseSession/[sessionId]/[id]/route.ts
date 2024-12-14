// 생성
import ExerciseSession from "@/models/ExerciseSession"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"

/**
 *  운동 시작시 상태를 변경하는 API
 * @param request 
 * @returns 
 */
export const POST = async (request: NextRequest) => {
    const { sessionId, exerciseId, state, sessionData, repTime } = await request.json();
    // console.log(sessionId, exerciseId, state, sessionData, repTime);
    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    await connect();

    const user = await User.findOne({ email: getSession.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    try {
        // 특정 exerciseId의 state 업데이트
        if (state === 'inProgress') {
            // console.log('inProgress');
            const updatedSession = await ExerciseSession.findOneAndUpdate(
                { _id: sessionId, "exercises._id": exerciseId },// 조건
                {
                    $set: { 'exercises.$.state': state, },  //(수정) 업데이트할 필드
                    $push: { 'exercises.$.session': sessionData }//(추가) 업데이트할 내용
                },
                { new: true } // 업데이트 후 새로운 문서를 반환
            );//$ 연산자는 배열의 요소에 접근하기 위해 사용
            // console.log(updatedSession.exercises[0].session);
            if (!updatedSession) {
                return NextResponse.json(
                    { error: "Exercise session or exercise not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ updatedSession, message: '세트 시작' }, { status: 201 });
        }
        if (state === 'done') {
            // console.log('done');
            const updatedSession = await ExerciseSession.findOneAndUpdate(
                { _id: sessionId, "exercises._id": exerciseId },// 조건
                {
                    $set: { 'exercises.$.state': state, 'exercises.$.repTime': repTime },  // 업데이트할 필드
                },
                { new: true } // 업데이트 후 새로운 문서를 반환
            );
            if (!updatedSession) {
                return NextResponse.json(
                    { error: "Exercise session or exercise not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ updatedSession, message: '운동 완료' }, { status: 201 });
        }
    } catch (err: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
}


export const PATCH = async (request: NextRequest) => {
    const { sessionId, exerciseId, detailSessionId, reps, weight } = await request.json();
    // console.log(sessionId, exerciseId);
    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    await connect();

    const user = await User.findOne({ email: getSession.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    try {
        const updatedSession = await ExerciseSession.findOneAndUpdate(
            { _id: sessionId, "exercises._id": exerciseId, "exercises.session._id": detailSessionId },// 조건
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
                    { "session._id": detailSessionId }
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
