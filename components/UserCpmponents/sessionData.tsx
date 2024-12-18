'use client'
import React from 'react'
import { useWeekSessions } from '@/server/queries';
import ShowWeek from './showWeek';
import ShowChart from './showChart';
const SessionData = () => {
    const { data, isLoading, isError } = useWeekSessions();
    return (
        <div className='flex  flex-col gap-4'>
            <ShowWeek data={data} isLoading={isLoading} isError={isError} />
            <ShowChart data={data} isLoading={isLoading} isError={isError} />
        </div>
    )
}

export default SessionData