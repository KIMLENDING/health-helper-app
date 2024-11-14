// pages/api/protected.ts
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export const GET = async (req: any, res: any) => {
    const session = await getServerSession();

    if (!session) {
        return new NextResponse("Unauthorized", { status: 400 });
    }
    return NextResponse.json({ session });
    //   return res.status(200).json({ message: "Protected data", session });
}
