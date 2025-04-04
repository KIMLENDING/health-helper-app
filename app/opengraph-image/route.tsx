import { ImageResponse } from "@vercel/og";

export const config = {
    runtime: 'edge',
};
export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#121212",
                    color: "white",
                    fontSize: "48px",
                    fontWeight: "bold",
                }}
            >
                H-Helper | 당신만의 운동 도우미
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
