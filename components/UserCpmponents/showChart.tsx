import React from 'react'

interface ShowChartProps {
    data: any; // message, session:ExerciseSession[]
    isLoading: boolean;
    isError: boolean;
}
const ShowChart = ({ data, isLoading, isError }: ShowChartProps) => {
    return (
        <section className="mx-auto w-full max-w-3xl rounded-xl ">
            일단
            1. 주간 총 운동 시간
            2. 주간 총 중량
            3. 주간 총 세트
            4. 주간 총 횟수
        </section>
    )
}

export default ShowChart