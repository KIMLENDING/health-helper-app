import Exercise from "@/models/Exercise"
import connect from "@/utils/db"
import { NextResponse } from "next/server"
import { exercise } from "@/utils/util"
export const PATCH = async (request: any) => {
    // 운동 수정
    const { title, tags, videoUrl } = await request.json();
    console.log(request)
    await connect()

}

export const DELETE = async (request: any) => {
    // 운동 삭제
    const { title, tags, videoUrl } = await request.json();
    console.log(request)
    await connect()

}