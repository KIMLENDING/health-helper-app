import Exercise from "@/models/Exercise"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { exercise } from "@/utils/util"
import { headers } from "next/headers"
export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 수정
    const exerciseId = (await params).exerciseId
    const { title, tags, videoUrl } = await request.json();
    console.log(title, tags, videoUrl)
    console.log(exerciseId)

    await connect();

    // 업데이트할 필드만 포함하는 객체 생성
    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (tags !== undefined) updateFields.tags = tags;
    if (videoUrl !== undefined) updateFields.videoUrl = videoUrl;

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

export const DELETE = async (request: any) => {
    // 운동 삭제
    const { title, tags, videoUrl } = await request.json();
    console.log(request)
    await connect()

}