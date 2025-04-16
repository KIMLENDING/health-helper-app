'use client';
import { columns } from '@/components/Table/columns';
import { DataTable } from '@/components/Table/data-table';
import { useEexercises, useExercisePlanById } from '@/server/queries';
import React, { use } from 'react'
/** 플랜 세부 CRUD 페이지 */
type Params = Promise<{ planId: string }>;
const page = (props: {
    params: Params;
}) => {
    const params = use(props.params);
    const planId = params.planId;
    const { data: preData } = useExercisePlanById(planId);
    const { data, isLoading } = useEexercises();

    // preData에 있는 값은 data에서 제거 후  DataTable에 전달   
    const filteredData = data?.filter((exercise: any) => {
        return !preData?.exercises.some((preExercise: any) => preExercise._id === exercise._id);
    });

    if (isLoading) return <div>Loading...</div>;
    return (
        <div>
            <DataTable columns={columns} data={filteredData} />
        </div>
    )
}

export default page