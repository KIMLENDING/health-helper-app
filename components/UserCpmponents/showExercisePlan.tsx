'use client'
import { useExercisePlan, } from '@/server/queries';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { DumbbellIcon, FlagIcon } from 'lucide-react';
import Link from 'next/link';

const ShowExercisePlan = () => {

    const { data, error, isLoading } = useExercisePlan(); // 필요한 운동 계획 데이터를 가져옵니다.
    const Icons = <DumbbellIcon className='text-green-400' />

    return (
        <div className='mx-auto w-full max-w-3xl rounded-xl'>
            <CardTitle className='my-3 font-extrabold text-2xl flex'>
                <div className='flex flex-row gap-2 items-center'>

                    플랜 목록
                </div>
            </CardTitle>
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="h-16 bg-gray-400 dark:bg-zinc-700 animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : (
                <>
                    {data ?
                        <div className='flex flex-col gap-3 rounded-xl bg-muted/50 p-2 max-h-[70vh] overflow-scroll'>{
                            data.map((plan) => (
                                <Card key={plan.title} className='aspect-auto '>
                                    <CardHeader className='px-0'>
                                        <CardTitle className="text-xl px-6 cursor-pointer  hover:underline">
                                            <Link href={`/dashboard/exercisePlans/${plan._id}`} className='flex flex-row gap-4'>
                                                {Icons}
                                                <div className='whitespace-nowrap overflow-hidden text-ellipsis w-32'> {plan.title}</div>
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            ))
                        }</div> :
                        <div className="flex items-center justify-center h-32 text-gray-500 text-lg font-medium">
                            운동 계획이 없습니다.
                        </div>
                    }
                </>
            )}

        </div>
    )
}

export default ShowExercisePlan