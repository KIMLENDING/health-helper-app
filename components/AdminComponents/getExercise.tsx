import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { DataTable } from '@/components/Table/data-table';
import { columns } from "@/components/Table/columns"
import { useEexercises } from '@/server/queries';


const GetExercise = () => {
    const { data, error, isLoading } = useEexercises();

    if (isLoading) {
        return <div className='w-full flex justify-center'>테이블 불러오는 중...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (

        <Card className="border-muted shadow-sm dark:shadow-md dark:shadow-black/10">
            <CardContent className='pt-4'>
                <div className="rounded-md overflow-hidden">
                    <DataTable columns={columns} data={data} />
                </div>
            </CardContent>
        </Card>


    )
}

export default GetExercise