
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Exercise, ExerciseOption } from "@/utils/util";



const formSchema = z.object({
    sets: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    reps: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    min: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    sec: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
})
const PlanDialogForm = ({ item, SetState, state }: { item: Exercise, SetState: React.Dispatch<React.SetStateAction<ExerciseOption[]>>, state?: ExerciseOption }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sets: 4,
            reps: 6,
            min: 1,
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
        SetState(prevState => { // 옵션 데이터를 업데이트합니다.
            const existingExercise = prevState.find(exercise => exercise.exerciseId === item._id)
            if (existingExercise) {
                return prevState.map(exercise => {
                    if (exercise.exerciseId === item._id) {
                        return { exerciseId: exercise.exerciseId, title: exercise.title, ...newData } // 기존 데이터에 새로운 데이터를 덮어씌웁니다.
                    } else {
                        return exercise // 기존 데이터를 그대로 반환합니다.
                    }
                })
            } else {
                return [...prevState, { exerciseId: item._id, title: item.title, ...newData }] // 새로운 데이터를 추가합니다.
            }
        });

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

export default PlanDialogForm;