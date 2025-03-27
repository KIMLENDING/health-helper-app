// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Exercise from "@/models/Exercise"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
import { getToken } from "next-auth/jwt"
export const POST = async (req: NextRequest) => {
    // 운동 추가
    const { title, description, url, tags } = await req.json();
    const getSession = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!getSession || !token) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    await connect();

    const user = await User.findOne({ email: getSession.user.email, provider: token.provider });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (user.role !== 'admin') {
        return NextResponse.json({ message: '관리자가 아닙니다.' }, { status: 403 });
    }
    const newExercise = new Exercise({
        title,
        description,
        url,
        tags,
    });
    try {
        await newExercise.save();
        return NextResponse.json({ message: '운동 추가 성공' }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}
export const GET = async (request: NextRequest) => {
    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    try {
        await connect();
        const exercises = await Exercise.find();
        return NextResponse.json(exercises);
    } catch (err: any) {
        return NextResponse.json(err, { status: 500 });
    }
}