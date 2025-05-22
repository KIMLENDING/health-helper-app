'use client'

import React from 'react'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { useInProgress } from '@/server/user/exerciseSession/queries'

const Floating = () => {
    const { data } = useInProgress();
    const { latestSessionId } = data || {}

    const badge = <Badge variant="outline">운동 상태</Badge>
    const statusDotClass = cn(
        'h-3 w-3 rounded-full border-[1px] ',
        latestSessionId ? 'bg-green-600 border-green-300/50' : 'bg-zinc-600 border-zinc-300/50'
    )

    return (
        <div className="flex items-center justify-end gap-2 w-full">
            {latestSessionId ? (
                <Link className="flex items-center" href={`/dashboard/exerciseSession/${latestSessionId}`}>
                    {badge}
                </Link>
            ) : (
                <div className="flex items-center ">{badge}</div>
            )}
            <div className={statusDotClass} />
        </div>
    )
}

export default Floating
