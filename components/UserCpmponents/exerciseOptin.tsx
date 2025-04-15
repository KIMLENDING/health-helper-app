"use client"

import { ExerciseOption, ExercisePlan } from "@/utils/util"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Card, CardHeader } from "../ui/card"
import { DumbbellIcon, PencilIcon } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useUpdatePlan } from "@/server/mutations"


const formSchema = z.object({
    sets: z.preprocess((value) => Number(value), z.number().min(1).nonnegative("숫자를 입력해주세요")),
    reps: z.preprocess((value) => Number(value), z.number().min(1).nonnegative("숫자를 입력해주세요")),
    weight: z.preprocess((value) => Number(value), z.number().min(1).nonnegative("숫자를 입력해주세요")),
})

interface ExerciseOptinProps {

    plan: ExercisePlan;
    exercise: ExerciseOption;
}
/** 운동 수정(세트,횟수,무게) 모달 */
const ExerciseOptin = ({ plan, exercise }: ExerciseOptinProps) => {
    const useUpdatePlanMutation = useUpdatePlan();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const newData = {

                title: plan.title,
                exercisePlanId: plan._id,
                exercises: [{
                    _id: exercise._id,
                    exerciseId: exercise.exerciseId,
                    title: exercise.title,
                    sets: values.sets,
                    reps: values.reps,
                    weight: values.weight
                }],
                type: "edit"
            }
            useUpdatePlanMutation.mutate(newData)
        } catch (error) {
            console.error("Failed to update plan:", error)
        }
    }

    return (
        <div>
            <Dialog >
                <DialogTrigger asChild>
                    <Button className="border-0 h-6 ring-0 shadow-none  " variant='outline' >
                        <PencilIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent className='p-0 border-0 bg-transparent rounded-lg'>
                    <DialogHeader >
                        <DialogTitle className=' hidden'></DialogTitle>
                        <DialogDescription className='hidden'></DialogDescription>
                        <Card>
                            <CardHeader className='p-0'>
                                <div key={exercise.exerciseId} className="border rounded p-4 ">
                                    <div className="flex items-center gap-2 mb-3 justify-between">
                                        <div className="flex flex-row gap-2">
                                            <DumbbellIcon className="w-5 h-5" />
                                            <h3 className="font-semibold">{exercise.title}</h3>
                                        </div>
                                    </div>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="sets"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>sets</FormLabel>
                                                        <FormControl>
                                                            <Input type="number"  {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="reps"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>reps</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="weight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>weight</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step={5} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogClose asChild>
                                                <Button type="submit" variant="secondary" >Submit</Button>
                                            </DialogClose>
                                        </form>
                                    </Form>
                                </div>
                            </CardHeader>
                        </Card>
                    </DialogHeader>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ExerciseOptin