import { DumbbellIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div>

            <div className="min-h-screen w-full">
                <nav className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <DumbbellIcon className="h-8 w-8 text-green-400" />
                        <span className="text-xl font-bold">FitHelper</span>
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
                            당신만의 맞춤 운동 도우미
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            FitHelper와 함께 건강한 라이프스타일을 만들어보세요. 개인 맞춤형
                            운동 프로그램, 전문가의 조언, 그리고 체계적인 건강관리를 경험하실 수
                            있습니다.
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

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">맞춤형 운동 계획</h3>
                            <p className="text-gray-600">
                                개인의 체력과 목표에 맞는 맞춤형 운동 프로그램을 제공합니다.
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">전문가 상담</h3>
                            <p className="text-gray-600">
                                경험 많은 트레이너들의 전문적인 조언을 받아보세요.
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">진행 상황 분석</h3>
                            <p className="text-gray-600">
                                운동 기록을 분석하여 효과적인 피드백을 제공합니다.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default page