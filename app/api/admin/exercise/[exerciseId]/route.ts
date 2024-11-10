import Exercise from "@/models/Exercise"
import User from "@/models/User"
import connect from "@/utils/db"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

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
        return NextResponse.redirect('/login');
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
    console.log(request)
    await connect()

}