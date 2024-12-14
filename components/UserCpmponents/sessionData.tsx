'use client'
import React from 'react'
import { useWeekSessions } from '@/server/queries';
import ShowWeek from './showWeek';
const SessionData = () => {
    const { data, isLoading, isError } = useWeekSessions();
    return (
        <div className='flex  flex-col '>
            <ShowWeek data={data} isLoading={isLoading} isError={isError} />
        </div>
    )
}

export default SessionData