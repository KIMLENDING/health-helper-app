// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Exercise from "@/models/Exercise"
import User from "@/models/User"
import connect from "@/utils/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 조회
    const exerciseId = (await params).exerciseId; // 요청에서 운동 ID 가져오기
    await connect();
    try {
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return NextResponse.json({ message: "Exercise not found" }, { status: 404 });
        }
        return NextResponse.json(exercise, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get exercise" }, { status: 500 });
    }
}

export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 수정

    const exerciseId = (await params).exerciseId
    const { title, tags, url } = await request.json();
    console.log(title, tags, url)
    console.log(exerciseId)

    // 로그인한 사용자가 관리자인지 확인
    // 관리자가 아니면 권한 없음 응답
    const session = await getServerSession(); // 사용자 정보를 가져오는 함수 (구현 필요)
    if (!session) { // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    const admin = await User.findOne({ email: session.user.email });
    if (!admin || admin.role !== "admin") { // 관리자가 아니면 권한 없음 응답
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }



    await connect();

    // 업데이트할 필드만 포함하는 객체 생성
    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (tags !== undefined) updateFields.tags = tags;
    if (url !== undefined) updateFields.url = url;

    try {
        const updatedExercise = await Exercise.findByIdAndUpdate(
            exerciseId,
            updateFields,
            { new: true }
        );
        if (!updatedExercise) {
            return NextResponse.json({ message: "Exercise not found" }, { status: 404 });
        }

        return NextResponse.json(updatedExercise, { status: 200 });// 업데이트된 운동 정보 반환
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update exercise" }, { status: 500 });
    }

}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 삭제
    const exerciseId = (await params).exerciseId; // 요청에서 운동 ID 가져오기
    // 로그인한 사용자가 관리자인지 확인
    // 관리자가 아니면 권한 없음 응답
    const session = await getServerSession(); // 사용자 정보를 가져오는 함수 (구현 필요)
    if (!session) { // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    const admin = await User.findOne({ email: session.user.email });
    if (!admin || admin.role !== "admin") { // 관리자가 아니면 권한 없음 응답
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connect()
    try {
        const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);
        if (!deletedExercise) {
            return NextResponse.json({ message: "Exercise not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Exercise 삭제 성공" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Exercise 삭제 실패" }, { status: 500 });
    }

}