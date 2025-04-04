'use client'
import React, { useEffect } from 'react'

import { useInProgress } from '@/server/queries'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

const Floating = () => {
    const { data } = useInProgress();

    return (
        <div>
            <div className="w-full">
                <div className="flex flex-row gap-2 items-center justify-between  ">
                    {data ? (
                        <Link className='flex items-center' href={`/dashboard/exerciseSession/${data._id}`}>
                            <Badge variant="outline">운동 상태</Badge>
                        </Link>
                    ) : (
                        <div className='flex items-center'>
                            <Badge variant="outline">운동 상태</Badge>
                        </div>
                    )}
                    <div
                        className={cn(
                            `h-3 w-3 rounded-full ${data ? 'bg-green-600' : 'bg-red-600'
                            }`
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default Floating;


