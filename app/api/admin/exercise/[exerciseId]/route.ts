// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Exercise from "@/models/Exercise"
import User from "@/models/User"
import connect from "@/utils/db"
import { getServerSession } from "next-auth"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 조회
    const exerciseId = (await params).exerciseId; // 요청에서 운동 ID 가져오기
    await connect();
    try {
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return NextResponse.json({ message: "운동이 존재하지 않습니다." }, { status: 404 });
        }
        return NextResponse.json(exercise, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "데이터 로딩 실패" }, { status: 500 });
    }
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 수정

    const exerciseId = (await params).exerciseId
    const { title, tags, url } = await req.json();

    // 로그인한 사용자가 관리자인지 확인
    // 관리자가 아니면 권한 없음 응답
    const getSession = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!getSession || !token) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
    }
    const admin = await User.findOne({ email: getSession.user.email, provider: token.provider });
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
            return NextResponse.json({ message: "유저정보가 없습니다." }, { status: 404 });
        }

        return NextResponse.json({ message: '데이터가 업데이트 성공' }, { status: 200 });// 업데이트된 운동 정보 반환
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "업데이트 실패" }, { status: 500 });
    }

}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) => {
    // 운동 삭제
    const exerciseId = (await params).exerciseId; // 요청에서 운동 ID 가져오기
    // 로그인한 사용자가 관리자인지 확인
    // 관리자가 아니면 권한 없음 응답
    const getSession = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!getSession || !token) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
    }
    const admin = await User.findOne({ email: getSession.user.email, provider: token.provider });
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