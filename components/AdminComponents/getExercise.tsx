import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { DataTable } from '@/app/dashboard/admin/addExercise/data-table';
import { Exercise, columns } from "@/app/dashboard/admin/addExercise/columns"
const GetExercise = () => {
    const [data, setData] = useState<Exercise[]>([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch('/api/admin/exercise', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('error', error);
                return null;
            }
        };

        fetchExercises().then(setData).catch(console.error);
    }, []);

    console.log('data', data)
    return (
        <div className="mx-auto h-[50vh] min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
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