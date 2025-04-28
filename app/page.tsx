import { Card } from '@/components/ui/card';
import { DumbbellIcon, Calendar, BarChart2, Timer } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const metadata = {
    title: "H-Helper | 홈",
    description: "개인 맞춤형 운동 도우미. 주간 히스토리, 분석 차트, 운동 타이머 기능 제공.",
};

const Page = () => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i);
        return {
            label: ["일", "월", "화", "수", "목", "금", "토"][i],
            name: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i],
            date: date,
            status: Math.random() > 0.6,
        };
    });

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* 네비게이션 바 */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b shadow-sm">
                <div className="flex items-center gap-2">
                    <DumbbellIcon className="h-8 w-8 text-emerald-500" />
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">H-Helper</span>
                </div>
                <div className="flex gap-4">
                    <Link href={'/login'} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                        로그인
                    </Link>
                    <Link href={'/register'} className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
                        회원가입
                    </Link>
                </div>
            </nav>

            <main>
                {/* 히어로 섹션 */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 -z-10"></div>
                    <div className="max-w-6xl mx-auto px-4 py-20">
                        <div className="flex flex-col items-center text-center gap-8">
                            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                                당신만의 운동 도우미
                            </h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
                                H-Helper와 함께 운동 계획을 세우고, 기록하고, 분석하세요.
                                개인 맞춤형 운동 관리로 건강한 생활 습관을 만들어 드립니다.
                            </p>
                            <div className="flex gap-4">
                                <Link href={'/login'} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg">
                                    시작하기
                                </Link>
                                <button className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
                                    더 알아보기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 주요 기능 섹션 */}
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-center mt-8 mb-16">
                        <span className="inline-block pb-2 border-b-2 border-emerald-400">H-Helper의 주요 기능</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* 주간 히스토리 카드 */}
                        <div className="p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                    <Calendar className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-semibold">주간 히스토리</h3>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                                <Card className="aspect-auto flex justify-between items-center p-4 select-none">
                                    {days.map((day, index) => (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                            <div
                                                className={`w-8 h-8 rounded-full border-2 flex flex-col items-center justify-center transition-colors duration-200
                                                ${day.status
                                                        ? "bg-emerald-500 border-emerald-600 text-white"
                                                        : "border-gray-300 bg-white text-gray-600 dark:bg-gray-800"}`}
                                                role="status"
                                                aria-label={`Exercise status for ${day.name}`}
                                            >
                                                <span className="text-sm font-semibold">
                                                    {day.date.getDate()}
                                                </span>
                                            </div>
                                            <span className="mt-2 text-sm font-semibold">
                                                {day.label}
                                            </span>
                                        </div>
                                    ))}
                                </Card>
                            </div>
                            <p className="text-base text-gray-600 dark:text-gray-400 mt-4">
                                주간 운동 히스토리를 확인하고 오늘의 운동 계획을 효과적으로 세워보세요.
                            </p>
                        </div>

                        {/* 분석 차트 */}
                        <div className="p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                    <BarChart2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-semibold">주간 운동 분석</h3>
                            </div>
                            <div className="relative rounded-lg overflow-hidden">
                                <video src="/chartVideo.mp4" autoPlay loop muted className="w-full h-auto rounded-lg">
                                    비디오를 불러올 수 없습니다.
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                                    <span className="text-white text-sm">운동 데이터 시각화</span>
                                </div>
                            </div>
                            <p className="text-base text-gray-600 dark:text-gray-400 mt-4">
                                상세한 운동 추세와 패턴을 분석하여 더 효율적인 운동 계획을 세울 수 있습니다.
                            </p>
                        </div>

                        {/* 운동 타이머 */}
                        <div className="p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                    <Timer className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-semibold">운동 타이머</h3>
                            </div>
                            <div className="relative rounded-lg overflow-hidden">
                                <video src="/healthtimer.mp4" autoPlay loop muted className="w-full h-auto rounded-lg">
                                    비디오를 불러올 수 없습니다.
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                                    <span className="text-white text-sm">타이머 기능</span>
                                </div>
                            </div>
                            <p className="text-base text-gray-600 dark:text-gray-400 mt-4">
                                세트 간 휴식시간 측정 및 HIIT 운동을 위한 인터벌 타이머로 효과적인 운동을 돕습니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA 섹션 */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 py-16 mt-16">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-3xl font-bold mb-6">지금 바로 시작하세요</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            H-Helper와 함께 더 건강한 라이프 스타일을 만들어보세요.
                            무료로 시작하고 언제든지 업그레이드할 수 있습니다.
                        </p>
                        <Link href={'/register'} className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg text-lg font-medium">
                            무료로 가입하기
                        </Link>
                    </div>
                </div>

                {/* 푸터 */}
                <footer className="bg-white dark:bg-gray-800 border-t py-8">
                    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <DumbbellIcon className="h-6 w-6 text-emerald-500" />
                            <span className="text-lg font-bold">H-Helper</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            © 2025 H-Helper. All rights reserved.
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Page;