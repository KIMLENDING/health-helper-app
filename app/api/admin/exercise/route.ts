// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Exercise from "@/models/Exercise"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { requireUser } from "@/lib/check-auth"

/**
 *  * 운동 추가
 * @param req 
 * @returns 
 */
export const POST = async (req: NextRequest) => {
    // 운동 추가
    const { title, description, url, tags } = await req.json();
    const { user, error, status } = await requireUser(req);
    if (!user) return NextResponse.json({ message: error }, { status });
    if (user.role !== 'admin') {
        return NextResponse.json({ message: '관리자가 아닙니다.' }, { status: 403 });
    }
    try {
        const newExercise = new Exercise({
            title,
            description,
            url,
            tags,
        });
        await newExercise.save();
        return NextResponse.json({ message: '운동 추가 성공' }, { status: 201 });
    } catch (err: any) {
        console.error(" [POST /api/admin/exercise] error:", err);
        return NextResponse.json(err, { status: 500 });
    }
}

/**
 *  * 운동 전체 조회
 * @param request 
 * @returns 
 */
export const GET = async () => {
    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
    }
    try {
        await connect();
        const exercises = await Exercise.find();
        return NextResponse.json(exercises);
    } catch (err: any) {
        console.error(" [GET /api/admin/exercise] error:", err);
        return NextResponse.json(err, { status: 500 });
    }
}