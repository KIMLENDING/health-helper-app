
import {
    DumbbellIcon,
    Calendar,
    Timer,
    PieChart,
    ListChecks,
    LineChart,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const metadata = {
    title: "H-Helper | 홈",
    description: "개인 맞춤형 운동 도우미. 주간 히스토리, 분석 차트, 운동 타이머 기능 제공.",
};

const Page = () => {

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* 네비게이션 바 */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b shadow-sm">
                <div className="flex items-center gap-2">
                    <DumbbellIcon className="h-8 w-8 text-emerald-500" />
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent whitespace-nowrap">H-Helper</span>
                </div>
                <div className="flex gap-4  break-keep">
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
                            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent break-keep">
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
                </div>                {/* 주요 기능 섹션 */}
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-center mt-8 mb-16">
                        <span className="inline-block pb-2 border-b-2 border-emerald-400">H-Helper의 주요 기능</span>
                    </h2>
                    <div className="space-y-24">
                        {/* 대시보드 섹션 */}
                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    대시보드
                                </div>
                                <h3 className="text-2xl font-bold">한 눈에 보는 운동 현황</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    대시보드에서 운동 요약, 최근 운동 기록, 다가오는 일정까지 모두 확인하세요.
                                    운동 습관을 시각적으로 분석하고 진행 상황을 추적할 수 있습니다.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">주간 운동 달성률 확인</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">최근 운동 기록 요약</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">운동 통계 분석</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-emerald-100 dark:border-emerald-900/20">
                                <video
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/video/dashboardPage.mp4" type="video/mp4" />
                                    브라우저가 비디오를 지원하지 않습니다.
                                </video>
                            </div>
                        </div>

                        {/* 운동 계획 섹션 */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    운동 계획
                                </div>
                                <h3 className="text-2xl font-bold">맞춤형 운동 루틴 생성</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    나에게 맞는 운동 루틴을 쉽게 생성하고 관리하세요.
                                    다양한 운동을 선택하고 세트, 반복 횟수, 무게를 설정하여
                                    개인화된 운동 플랜을 만들 수 있습니다.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">간편한 운동 선택 인터페이스</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">세트/반복 횟수/무게 설정</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">루틴 저장 및 공유</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-emerald-100 dark:border-emerald-900/20">
                                <video
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/video/createPlanPage.mp4" type="video/mp4" />
                                    브라우저가 비디오를 지원하지 않습니다.
                                </video>
                            </div>
                        </div>

                        {/* 운동 세션 섹션 */}
                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    운동 세션
                                </div>
                                <h3 className="text-2xl font-bold">실시간 운동 추적 및 기록</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    운동 세션 중에 실시간으로 진행 상황을 추적하고 기록하세요.
                                    각 세트마다 수행한 무게와 반복 횟수를 입력하고 타이머로 휴식 시간을 관리할 수 있습니다.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">세트별 기록 관리</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">휴식 타이머</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">운동 완료 및 진행률</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-emerald-100 dark:border-emerald-900/20">
                                <video
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/video/exerciseSessionPage.mp4" type="video/mp4" />
                                    브라우저가 비디오를 지원하지 않습니다.
                                </video>
                            </div>
                        </div>

                        {/* 상세 분석 섹션 */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    상세 분석
                                </div>
                                <h3 className="text-2xl font-bold">운동 데이터 심층 분석</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    운동 기록을 상세하게 분석하여 성과와 개선점을 파악하세요.
                                    세부적인 운동 정보와 시간 경과에 따른 진행 상황을 확인할 수 있습니다.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">데이터 시각화</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">진행 상황 추적</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">목표 대비 성과</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-emerald-100 dark:border-emerald-900/20">
                                <video
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/video/detailPage.mp4" type="video/mp4" />
                                    브라우저가 비디오를 지원하지 않습니다.
                                </video>
                            </div>
                        </div>

                        {/* 플랜 관리 섹션 */}
                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    플랜 관리
                                </div>
                                <h3 className="text-2xl font-bold">운동 플랜 관리 및 조정</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    저장된 운동 플랜을 쉽게 관리하고 필요에 따라 조정하세요.
                                    새로운 운동을 추가하거나 기존 플랜을 수정하여 항상 최신 상태를 유지할 수 있습니다.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">플랜 목록 관리</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">세부 정보 수정</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">운동 추가 및 삭제</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-emerald-100 dark:border-emerald-900/20">
                                <video
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/video/planDetailPage.mp4" type="video/mp4" />
                                    브라우저가 비디오를 지원하지 않습니다.
                                </video>
                            </div>
                        </div>

                        {/* 플랜 개요 섹션 */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    플랜 개요
                                </div>
                                <h3 className="text-2xl font-bold">운동 플랜 개요 및 선택</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    모든 운동 플랜을 한눈에 보고 오늘의 루틴을 쉽게 선택하세요.
                                    자신만의 플랜 라이브러리를 구축하고 상황에 맞게 활용할 수 있습니다.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">전체 플랜 목록</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">빠른 운동 시작</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-700 dark:text-gray-300">플랜 정렬 및 필터링</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-emerald-100 dark:border-emerald-900/20">
                                <video
                                    className="w-full h-auto"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/video/planPage.mp4" type="video/mp4" />
                                    브라우저가 비디오를 지원하지 않습니다.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>                {/* CTA 섹션 */}
                <div className="relative py-24 mt-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 -z-10"></div>
                    <div className="absolute inset-0 opacity-10 bg-grid-white/20 -z-10"></div>
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-4xl font-bold mb-6 text-white">지금 바로 시작하세요</h2>
                        <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
                            H-Helper와 함께 더 건강한 라이프 스타일을 만들어보세요.
                            무료로 시작하고 언제든지 업그레이드할 수 있습니다.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={'/register'}
                                className="px-8 py-4 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl text-lg font-medium"
                            >
                                무료로 가입하기
                            </Link>
                            <Link
                                href={'/login'}
                                className="px-8 py-4 bg-emerald-800/40 text-white rounded-lg hover:bg-emerald-800/60 border border-emerald-400/30 transition-colors shadow-md hover:shadow-lg text-lg font-medium"
                            >
                                로그인하기
                            </Link>
                        </div>
                        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-white">
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-white/10 rounded-full mb-3">
                                    <DumbbellIcon className="h-6 w-6" />
                                </div>
                                <p className="text-sm">운동 계획</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-white/10 rounded-full mb-3">
                                    <Timer className="h-6 w-6" />
                                </div>
                                <p className="text-sm">타이머</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-white/10 rounded-full mb-3">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <p className="text-sm">달력 관리</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-white/10 rounded-full mb-3">
                                    <PieChart className="h-6 w-6" />
                                </div>
                                <p className="text-sm">통계 분석</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-white/10 rounded-full mb-3">
                                    <LineChart className="h-6 w-6" />
                                </div>
                                <p className="text-sm">진척도</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-white/10 rounded-full mb-3">
                                    <ListChecks className="h-6 w-6" />
                                </div>
                                <p className="text-sm">목표 설정</p>
                            </div>
                        </div>
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