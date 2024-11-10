import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { DataTable } from '@/app/dashboard/admin/addExercise/data-table';
import { columns } from "@/app/dashboard/admin/addExercise/columns"
import { useEexercises } from '@/server/queries';


const GetExercise = () => {
    const { data, error, isLoading } = useEexercises();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="mx-auto max-h-[50vh] min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
            <Card>
                <CardHeader>
                    <CardTitle>운동 리스트</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
        </div>
    )
}

export default GetExercise