import { AddExercise } from '@/components/AdminComponents/addExercise'
import React from 'react'

const AddExercisePage = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
            <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" >
                <AddExercise />
            </div>
        </div>
    )
}

export default AddExercisePage