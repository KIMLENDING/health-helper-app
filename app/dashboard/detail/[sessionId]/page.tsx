'use client';
import LoadingSpinner from '@/components/LayoutCompents/LoadingSpinner';
import TotalTitleBySession from '@/components/UserCpmponents/chartComponents/session/totalTitleBySession';
import TotalTitleByWeight from '@/components/UserCpmponents/chartComponents/session/totalTitleByWeight';
import { useGetExerciseSession } from '@/server/queries';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'




const Page = () => {
    const params = useParams();
    const { data, isLoading, isError } = useGetExerciseSession(params.sessionId as string);
    const [filter, setFilter] = useState(data)
    console.log(data)
    useEffect(() => {
        if (data) {

            const updatedObject = {
                ...data,
                exercises: data.exercises.filter(exercise => exercise.session.length > 0)
            };
            setFilter(updatedObject);
        }


    }, [data])
    console.log('filter', filter)


    if (isLoading) return <LoadingSpinner />;
    if (isError) return <div>Error loading data</div>;
    return (
        <div>

            <TotalTitleByWeight data={filter} />
            <TotalTitleBySession data={filter} />
        </div >
    )
}

export default Page