import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log('token', token);
    return NextResponse.json({

        name: token.name,
        email: token.email,
        image: token.picture,
        provider: token.provider,
        role: token.role,
        message: "Authorized",
    }, { status: 200 });
}
