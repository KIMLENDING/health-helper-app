// lib/auth/check-auth.ts
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import User from "@/models/User"
import connect from '@/utils/db';


export async function requireUser(req: NextRequest) {
    const session = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session || !token) {
        return { user: null, error: 'Unauthorized', status: 401 };
    }

    await connect();
    const user = await User.findOne({ email: session.user.email, provider: token.provider });

    if (!user) {
        return { user: null, error: 'User not found', status: 404 };
    }

    return { user, session, token };
}
