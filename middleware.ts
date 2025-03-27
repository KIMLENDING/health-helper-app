import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    // JWT 토큰을 확인 (next-auth의 getToken 사용)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 보호된 경로 설정
    const protectedPaths = ['/dashboard'];
    const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

    // 보호된 경로에 접근하려고 하지만 토큰이 없는 경우 로그인 페이지로 리다이렉션
    if (isProtectedPath && !token) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // 요청을 그대로 진행
    return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
    matcher: ['/dashboard/:path*'], // `/dashboard` 및 하위 경로에만 미들웨어 적용
};