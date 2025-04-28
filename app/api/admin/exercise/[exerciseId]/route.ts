// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { requireUser } from "@/lib/check-auth"
import Exercise from "@/models/Exercise"
import { NextRequest, NextResponse } from "next/server"


export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 수정

    const exerciseId = (await params).exerciseId
    const { title, tags, url } = await req.json();
    // 로그인한 사용자가 관리자인지 확인
    const { user, error, status } = await requireUser(req);
    if (!user) return NextResponse.json({ message: error }, { status });

    if (!user || user.role !== "admin") { // 관리자가 아니면 권한 없음 응답
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

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
            return NextResponse.json({ message: "수정 할 운동과 일치하는 Id가 없습니다." }, { status: 404 });
        }
        return NextResponse.json({ message: '데이터가 업데이트 성공' }, { status: 200 });// 업데이트된 운동 정보 반환
    } catch (err) {
        console.error(" [PATCH /api/admin/exercise/[exerciseId]] error:", err);
        return NextResponse.json({ message: "업데이트 실패" }, { status: 500 });
    }
}


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 삭제
    const exerciseId = (await params).exerciseId; // 요청에서 운동 ID 가져오기
    // 로그인한 사용자가 관리자인지 확인
    // 관리자가 아니면 권한 없음 응답
    const { user, error, status } = await requireUser(req);
    if (!user) return NextResponse.json({ message: error }, { status });

    if (!user || user.role !== "admin") { // 관리자가 아니면 권한 없음 응답
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    try {
        const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);
        if (!deletedExercise) {
            return NextResponse.json({ message: "Exercise not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Exercise 삭제 성공" }, { status: 200 });
    } catch (err) {
        console.error(" [DELETE /api/admin/exercise/[exerciseId]] error:", err);
        return NextResponse.json({ message: "Exercise 삭제 실패" }, { status: 500 });
    }

}