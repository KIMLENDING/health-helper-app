import { Card } from '@/components/ui/card'
import { DumbbellIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
export const metadata = {
    title: "H-Helper | 당신만의 운동 도우미",
    description: "H-Helper와 함께 건강한 라이프스타일을 만들어보세요.",
    openGraph: {
        title: "H-Helper | 당신만의 운동 도우미",
        description: "H-Helper와 함께 건강한 라이프스타일을 만들어보세요.",
        url: "https://health-helper-app.vercel.app/",
        siteName: "H-Helper",
        images: [
            {
                url: "/opengraph-image", // 동적으로 생성된 이미지
                width: 1200,
                height: 630,
                alt: "H-Helper 메인 페이지",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "H-Helper | 당신만의 운동 도우미",
        description: "개인 맞춤형 운동 프로그램을 경험하세요.",
        images: ["/opengraph-image"], // 트위터에서도 동일한 동적 이미지 사용
    },
};


const page = () => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i); // Adjust to match the correct day of the week
        return {
            label: ["일", "월", "화", "수", "목", "금", "토"][i],
            name: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i],
            date: date,
            status: Math.random() > 0.6, // Random status for demonstration
        };
    });
    return (
        <div>
            <div className="min-h-screen w-full">
                <nav className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <DumbbellIcon className="h-8 w-8 text-green-400" />
                        <span className="text-xl font-bold">H-Helper</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href={'login'} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-gray-300">
                            로그인
                        </Link>
                        <Link href={'register'} className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-white/10">
                            회원가입
                        </Link>
                    </div>
                </nav>

                <main className="max-w-6xl mx-auto px-4 py-16">
                    <div className="flex flex-col items-center text-center gap-8">
                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                            당신만의 운동 도우미
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            {/* FitHelper와 함께 건강한 라이프스타일을 만들어보세요. 개인 맞춤형
                            운동 프로그램, 전문가의 조언, 그리고 체계적인 건강관리를 경험하실 수
                            있습니다. */}
                        </p>
                        <div className="flex gap-4">
                            <Link href={'login'} className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-gray-300">
                                시작하기
                            </Link>
                            <button className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-white/10">
                                더 알아보기
                            </button>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-center mt-16">
                            H-Helper의 주요 기능
                        </h2>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">주간 히스토리</h3>
                                <div className=' bg-muted/50 p-2 rounded-xl '>
                                    <Card className="aspect-auto flex justify-between items-center  p-4 select-none ">
                                        {days.map((day, index) => (
                                            <div key={index} className="flex flex-col items-center flex-1">
                                                <div
                                                    className={`
                                                        px-1 rounded-full border-2 flex flex-col items-center justify-center transition-colors duration-200
                                                        ${day.status ? "bg-green-500 border-green-700 text-white" : "border-gray-300 bg-white text-gray-600"}`}
                                                    role="status"
                                                    aria-label={`Exercise status for ${day.name}`}
                                                >
                                                    <span className="text-sm font-semibold">
                                                        {day.date.getDate()}
                                                    </span>
                                                </div>

                                                <span className="mt-2 text-sm font-semibold  ">
                                                    {day.label}
                                                </span>
                                            </div>
                                        ))}
                                    </Card>
                                </div>
                                <p className="text-lg px-2 text-zinc-300 max-w-2xl mt-4">
                                    <span>주간 운동 히스토리를 확인해보세요.</span><br />
                                    <span>오늘의 운동 계획을 세우는데 도움이 됩니다.</span>
                                </p>
                            </div>

                            <div className="p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-2 ml-1">주간 운동 분석 차트</h3>
                                <video src="/chartVideo.mp4" autoPlay loop muted className="w-full h-auto rounded-lg">
                                    비디오를 불러올 수 없습니다.
                                </video>
                            </div>

                            <div className="p-6 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-2 ml-1">운동 타이머</h3>
                                {/* <Image src={'/healthTimer.png'} height={1200} width={1200} alt='타이머 소개 이미지'></Image> */}
                                <video src="/healthtimer.mp4" autoPlay loop muted className="w-full h-auto rounded-lg">
                                    비디오를 불러올 수 없습니다.
                                </video>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default page