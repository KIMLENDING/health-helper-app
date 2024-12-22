'use client';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import TotalTitleByWeight from '@/components/UserCpmponents/chartComponents/session/totalTitleByWeight';

import { useGetExerciseSession } from '@/server/queries';
import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import { TrendingUp } from 'lucide-react';

import { useParams } from 'next/navigation';
import React from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';



const Page = () => {
    const params = useParams();
    const { data, isLoading, isError } = useGetExerciseSession(params.sessionId as string);


    if (isLoading) return <LoadingSpinner />;
    return (
        <div>
            운동 분석 페이지 입니다.


            <TotalTitleByWeight data={data} />


        </div >
    )
}

export default Page