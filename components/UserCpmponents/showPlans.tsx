'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
    Activity,
    Dumbbell,
    Flame,
    Trophy,
    Clock,
    ChevronRight,
    Filter,
    PlusCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { DrawerDialogDemo } from '../LayoutCompents/ResponsiveDialog'
import { useExercisePlan } from '@/server/user/exercisePlan/queries'

const ShowPlans = () => {
    const { data, isError, isLoading } = useExercisePlan()



    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
                <Link href="/dashboard/exercisePlans">
                    <CardTitle className="font-extrabold text-2xl group flex items-center">
                        <span className="group-hover:underline">플랜 목록</span>
                        <ChevronRight size={20} className="ml-1 opacity-70" />
                    </CardTitle>
                </Link>

            </div>

            <div className="rounded-xl bg-muted/30 p-4 h-72 overflow-y-auto scrollbar-hide shadow-sm border border-gray-100 dark:border-gray-800">
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="h-20 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex justify-center items-center h-full text-red-500">
                        데이터를 불러오는 중 오류가 발생했습니다. 새로고침해 보세요.
                    </div>
                ) : data && data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {data.map((plan, index) => {

                            return (
                                <Card key={plan._id || index} className="bg-white dark:bg-zinc-800 border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
                                    <CardHeader className="p-4 pb-1">
                                        <DrawerDialogDemo planId={plan._id!}>
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <Dumbbell className="text-blue-500" size={20} />
                                                    <CardTitle className="text-lg font-bold truncate" title={plan.title}>
                                                        {plan.title}
                                                    </CardTitle>
                                                </div>
                                                <ChevronRight size={16} className="text-gray-400" />
                                            </div>
                                        </DrawerDialogDemo>
                                    </CardHeader>
                                    <CardContent className="text-sm text-gray-500 p-4 pt-1 ">
                                        <div className="flex justify-between px-2">
                                            <span>{plan.exercises?.length || 0}개 운동</span>
                                            <span> {plan.lastPlayed ? `${Math.floor((new Date().getTime() - new Date(plan.lastPlayed).getTime()) / (1000 * 60 * 60 * 24))}일전` : '기록없음'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
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
            </div>
        </div>
    )
}

export default ShowPlans