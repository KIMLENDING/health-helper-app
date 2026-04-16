import React, { useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { DataTable } from '@/components/Table/data-table';
import { columns } from "@/components/Table/columns"
import { useEexercises } from '@/server/admin/queries';
import { Dumbbell } from 'lucide-react';
import { useSelectedExercise } from '@/server/mutations';
import { useSelectedExercises } from '@/server/queries';



const GetExercise = () => {
    const { data, error, isLoading } = useEexercises();
    const useSelectedExerciseMutation = useSelectedExercise();

    const handleRowSelectionChange = (selectedRows: any[]) => {
        useSelectedExerciseMutation.mutate(selectedRows);
    };

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
                    <DataTable
                        columns={columns}
                        data={data}
                        title="운동 목록"
                        titleIcon={<Dumbbell className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />}
                        filterKey="title"
                        availableTags={['상체', '하체', '가슴', '등', '어깨', '팔', '허벅지', '종아리']}
                        onRowSelectionChange={handleRowSelectionChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export default GetExercise