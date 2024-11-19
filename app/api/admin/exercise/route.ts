// eslint-disable-next-line @typescript-eslint/no-explicit-any
import Exercise from "@/models/Exercise"
import connect from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import User from "@/models/User"
export const POST = async (request: NextRequest) => {
    // 운동 추가
    const { title, description, url, tags } = await request.json();
    const getSession = await getServerSession();
    if (!getSession) {
        // 로그인 안되어있으면 로그인 페이지로 이동
        return NextResponse.redirect('http://localhost:3000/login');
    }
    await connect();
    // getSession.user.email 이 값으로 사용자를 찾아서 role을 확인해야함
    // role이 admin이 아니면 return
    // role이 admin이면 운동 추가
    const user = await User.findOne({ email: getSession.user.email });
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