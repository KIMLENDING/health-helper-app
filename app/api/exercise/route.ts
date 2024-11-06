import Exercise from "@/models/Exercise"
import connect from "@/utils/db"
import { NextResponse } from "next/server"
import { exercise } from "@/utils/util"
export const POST = async (request: any) => {
    // 운동 추가
    const { title, tags, videoUrl } = await request.json();
    console.log(request)
    await connect()
    // 관리자만 추가 가능
    // const isAdmin = request.


}