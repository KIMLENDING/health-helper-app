'use client'

import { useState } from 'react';
import { useExercisePlan } from '@/server/user/exercisePlan/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Dumbbell, Flag, PlusCircle, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const ShowExercisePlan = () => {
    const { data, error, isLoading } = useExercisePlan();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-red-50 dark:bg-red-900/20">
                <div className="text-red-500 text-lg font-medium mb-2">운동 계획을 불러오는 중 오류가 발생했습니다.</div>
                <button className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors">
                    다시 시도하기
                </button>
            </div>
        );
    }

    const filteredPlans = data?.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto w-full max-w-4xl  py-4  min-h-[calc(100vh-56px)] relative flex flex-col gap-4">

            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">운동 플랜 목록</h1>
                        <p className="text-white/80">운동 리스트 입니다.</p>
                    </div>
                </div>
            </div>
            {!isLoading && data && data.length > 0 && (
                <div className="relative w-full ">
                    <input
                        type="text"
                        placeholder="플랜 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-700 focus:outline-none bg-white dark:bg-zinc-900"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col gap-4 mt-6">
                    {[1, 2, 3].map((index) => (
                        <Card key={index} className="overflow-hidden border-0 shadow-md">
                            <div className="flex p-6">
                                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse mr-4"></div>
                                <div className="flex-1">
                                    <div className="h-5 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded w-1/2"></div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    {data && data.length > 0 ? (
                        <div className="flex flex-col gap-4 mb-24 ">
                            {filteredPlans?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                    <p className="text-zinc-500 text-lg font-medium mb-2">검색 결과가 없습니다</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                                    >
                                        전체 플랜 보기
                                    </button>
                                </div>
                            ) : (
                                filteredPlans?.map((plan) => (
                                    <Link key={plan._id} href={`/dashboard/exercisePlans/${plan._id}`}>
                                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer border border-zinc-200 dark:border-zinc-800">
                                            <CardContent className="p-0">
                                                <div className="flex items-start p-4">
                                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
                                                        <Dumbbell className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg mb-1 text-zinc-900 dark:text-zinc-100">{plan.title}</h3>
                                                        <div className="flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-4 w-4 mr-1" />
                                                                <span>{plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : '날짜 없음'}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                <span>{plan.exercises?.length || 0}개 운동</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-zinc-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-zinc-50 dark:bg-zinc-800/30">
                            <Dumbbell size={40} className="text-zinc-300 mb-2" />
                            <div className="text-zinc-500 text-lg font-medium mb-6">아직 운동 계획이 없습니다.</div>
                            <Link href="/dashboard/user/createPlan">
                                <button className="px-6 py-3 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center transition-colors">
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    첫 번째 운동 계획 만들기
                                </button>
                            </Link>
                        </div>
                    )}
                </>
            )}

            <div className="fixed bottom-8 right-8 md:absolute md:bottom-8 md:right-4">
                <Link href="/dashboard/user/createPlan">
                    <button className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors">
                        <PlusCircle className="h-6 w-6" />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ShowExercisePlan;