import { ImageResponse } from "next/og";

export const runtime = "edge"; // ✅ Next.js 13+에서는 edge runtime 사용 권장

export async function GET() {
    return new ImageResponse(
        (
            <svg
                width="1200"
                height="630"
                viewBox="0 0 1200 630"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* ✅ 배경색 변경 */}
                <rect width="100%" height="100%" fill="black" />

                {/* ✅ 텍스트 스타일 및 배치 수정 */}
                <text
                    x="50%"
                    y="50%"
                    fontSize="60"
                    fill="white"
                    textAnchor="middle"
                    dy=".3em"
                >
                    H-Helper | 당신만의 운동 도우미
                </text>
            </svg>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
