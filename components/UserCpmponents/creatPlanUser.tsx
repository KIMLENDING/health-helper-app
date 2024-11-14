import { getSelectedExercises } from '@/server/queries';
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import GetExercise from '../AdminComponents/getExercise';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Exercise } from '@/app/dashboard/admin/addExercise/columns';
import { set } from 'mongoose';
import { XIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
interface ExercisePlan {
    userId: string,
    title: string,
    description: string,
    exercises: exercises[]
}

interface exercises {
    exerciseId: string,
    sets: number,
    reps: number,
    rest: number
}


const formSchema = z.object({
    sets: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    reps: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    min: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    sec: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
})
const formSchema2 = z.object({
    title: z.string().nonempty("제목을 입력해주세요"),
    description: z.string().nonempty("설명을 입력해주세요"),

})

const PlanForm = ({ item, SetState, state }: { item: Exercise, SetState: React.Dispatch<React.SetStateAction<exercises[]>>, state?: exercises }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sets: 0,
            reps: 0,
            min: 0,
            sec: 0
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // 각 Card의 제출 데이터를 처리하는 로직
        const newData =
        {
            sets: data.sets,
            reps: data.reps,
            rest: data.min * 60 + data.sec
        }
        SetState(prevState => {
            const existingExercise = prevState.find(exercise => exercise.exerciseId === item._id)
            if (existingExercise) {
                return prevState.map(exercise => {
                    if (exercise.exerciseId === item._id) {
                        return { exerciseId: exercise.exerciseId, ...newData } // 기존 데이터에 새로운 데이터를 덮어씌웁니다.
                    } else {
                        return exercise // 기존 데이터를 그대로 반환합니다.
                    }
                })
            } else {
                return [...prevState, { exerciseId: item._id, ...newData }] // 새로운 데이터를 추가합니다.
            }
        });
        console.log(item._id, newData);
        // 상위 컴포넌트에 데이터를 반환하는 로직
    };

    return (
        <Dialog key={item._id}>
            <DialogTrigger asChild>
                <Button >
                    {state ? <div>
                        {state?.sets}세트,{' '}
                        {state?.reps}회,{' '}
                        {state?.rest && `${Math.floor(state.rest / 60)}분 ${state.rest % 60}초`}
                    </div> : '상세 설정'
                    }
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <Card className="w-full ">
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-4">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="sets"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>총 세트</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0" min={0} {...field} type="number" />
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
                                                    <FormLabel>세트 당 반복횟수</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0" min={0} {...field} type="number" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex flex-row">
                                            <FormField
                                                control={form.control}
                                                name="min"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>분</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="00분" {...field} type="number" step="1" max={10} min={0} />
                                                        </FormControl>
                                                        <FormDescription>휴식시간</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="sec"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>초 </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="00초" {...field} type="number" step="5" max={55} min={0} />
                                                        </FormControl>
                                                        <FormDescription></FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter className="sm:justify-start">
                                            <DialogClose asChild>
                                                <Button type="submit" variant="secondary">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </div>
                        </CardContent>
                    </Card>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    );
};
const CreatPlanUser = () => {
    const form = useForm<z.infer<typeof formSchema2>>({
        resolver: zodResolver(formSchema2),
        defaultValues: {
            title: '',
            description: '',
        },
    });
    const { data: session } = useSession();
    const [planData, setPlanData] = useState<Exercise[]>([]) // 가져온 운동 종목 데이터를 저장하는 변수
    const [enterPlanData, setEnterPlanData] = useState<exercises[]>([]) // 이건 서버에 보낼 데이터
    const { data, error, isLoading } = getSelectedExercises(); // 필요한 운동 종목 데이터를 가져옵니다.
    useEffect(() => { // 데이터가 있으면 planData에 추가합니다.
        if (data) {
            setPlanData(prevState => {
                const existingExercise = prevState.find(exercise => exercise._id === data[0]._id)
                if (existingExercise) {
                    return prevState;
                } else {
                    return [...prevState, ...data];
                }
            });
        }
    }, [data])

    const handleDelete = (id: string) => {
        // 삭제 로직
        // 운동 종목 삭제
        setPlanData(prevState => prevState.filter(exercise => exercise._id !== id)) // 삭제할 데이터를 제외한 나머지 데이터를 반환합니다.
        // 상세 데이터 삭제 - 세트, 반복횟수, 휴식시간 , exerciseId
        setEnterPlanData(prevState => prevState.filter(exercise => exercise.exerciseId !== id)) // 삭제할 데이터를 제외한 나머지 데이터를 반환합니다.
    }
    function onSubmit2(values: z.infer<typeof formSchema2>) {
        // 루틴 제출 로직
        // 서버 데이터 전송 로직 만드러양함
        console.log(values)
    }
    console.log(planData)
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="mx-auto  min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
            <Card>
                <CardHeader >
                    <div className='space-y-8'>
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-2'>
                                <CardTitle>루틴에 운동 추가</CardTitle>
                                <CardDescription>순서는 나중에 설정할 수 있습니다.</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>

                                    <Button >추가</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    {/* <DialogHeader> */}
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription></DialogDescription>
                                    <div className="relative mb-4">
                                        <GetExercise />
                                    </div>
                                    {/* </DialogHeader> */}
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit2)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>루틴 이름</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex) 월요일 루틴, 상체+가슴" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}

                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>설명</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ex) 상체 펌핑" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <CardContent className='rounded-md shadow-inner bg-zinc-300 dark:bg-zinc-800 '>
                                        <div className='rounded-md  '>
                                            <div className='flex flex-col   max-h-[45vh] scrollbar-none overflow-y-scroll'>

                                                {planData.length !== 0 ? planData?.map((item) => (
                                                    <Card key={item._id} className='mt-5 '>
                                                        <CardHeader >
                                                            <CardTitle className='flex flex-row justify-between'>
                                                                <div className='flex items-center'>
                                                                    {item.title}
                                                                </div>
                                                                <Button variant="outline" size="icon" onClick={() => handleDelete(item._id)}>
                                                                    <XIcon />
                                                                </Button>
                                                            </CardTitle>

                                                            <PlanForm item={item} key={item._id} SetState={setEnterPlanData} state={enterPlanData.find((v) => v.exerciseId === item._id)} />
                                                        </CardHeader>
                                                    </Card>
                                                )) : <div> 루틴을 추가하세요</div>}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                    {/* <CardDescription></CardDescription> */}
                </CardHeader>

            </Card>
        </div>

    )
}

export default CreatPlanUser