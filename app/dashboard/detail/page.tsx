'use client';
import { useAllSessions } from "@/server/queries";
import { ExerciseOptionSession, ExerciseSession } from "@/utils/util";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const Page = () => {

    const { data, isLoading, isError } = useAllSessions();
    const a = data?.allSession.map((sessionData: ExerciseSession) => {
        return { ...sessionData, exercises: sessionData.exercises = sessionData.exercises.filter(exercise => exercise.session.length > 0) }
    });

    if (isLoading) return <div>Loading...</div>
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Detail</h1>
            <Accordion type="multiple" >
                {a.map((session: ExerciseSession) => {
                    return (
                        <AccordionItem value={`${session._id}`} key={session._id}>
                            <div key={session._id} className="mb-4 p-4 py-2 border rounded-lg shadow-md bg-white dark:bg-zinc-800">
                                <AccordionTrigger className="text-2xl font-semibold py-2 text-zinc-900 dark:text-zinc-100">{session.createdAt?.split('T')[0]}</AccordionTrigger>
                                <AccordionContent>

                                    {session.exercises.map((exercise: ExerciseOptionSession) => {
                                        return (
                                            <AccordionItem value={`${exercise._id}`} key={exercise._id}>
                                                <div key={exercise._id} >
                                                    <AccordionTrigger className="text-xl font-medium py-3 text-zinc-900 dark:text-zinc-100">{exercise.title}</AccordionTrigger>
                                                    {exercise.session.map((data) => {
                                                        return (
                                                            <AccordionContent key={data._id} className="flex gap-4">
                                                                <p className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded">{data.set}세트</p>
                                                                <p className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded">{data.reps}회</p>
                                                                <p className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded">{data.weight}kg</p>
                                                            </AccordionContent>
                                                        )
                                                    })}
                                                </div>
                                            </AccordionItem>
                                        )
                                    })}

                                </AccordionContent>
                            </div>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    );
};

export default Page