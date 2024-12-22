import { ExerciseOptionSession, ExercisesessionData } from '@/utils/util';
import React from 'react'

const TotalTitleBySession = ({ data }: { data: any }) => {
    const titleBySession = data?.exercises.flatMap((exercise: ExerciseOptionSession) => {
        return {
            title: exercise.title,
            session: exercise.session.map((s: ExercisesessionData) => {
                return { sessionSet: s.set, sessionRep: s.reps, sessionWeight: s.weight }
            }),

        }
    });
    return (
        <div>

        </div>
    )
}

export default TotalTitleBySession