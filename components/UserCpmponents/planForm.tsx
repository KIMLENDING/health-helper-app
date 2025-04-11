
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Exercise, ExerciseOption } from "@/utils/util";

const formSchema = z.object({
    sets: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    reps: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
    weight: z.preprocess((value) => Number(value), z.number().min(0).nonnegative("숫자를 입력해주세요")),
})
const PlanDialogForm = ({ item, SetState, state }: { item: Exercise, SetState: React.Dispatch<React.SetStateAction<ExerciseOption[]>>, state?: ExerciseOption }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sets: 4,
            reps: 6,
            weight: 30,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // 각 Card의 제출 데이터를 처리하는 로직
        const newData =
        {
            sets: data.sets,
            reps: data.reps,
            weight: data.weight,
        }
        SetState(prevState => { // 옵션 데이터를 업데이트합니다.
            const existingExercise = prevState.find(exercise => exercise.exerciseId === item._id) // 기존에 있는 운동인지 확인합니다.
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
    };

    return (
        <Dialog key={item._id} >
            <DialogTrigger asChild>
                <Button >
                    {state ? <div>
                        {state?.sets}세트,{' '}
                        {state?.reps}회,{' '}
                        {state?.weight}kg{' '}
                    </div> : '상세 설정'
                    }
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg">
                <DialogHeader>
                    <DialogTitle className="pb-2">{item.title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <Card className="w-full border-none">
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="sets"
                                        render={({ field }) => (
                                            <FormItem >
                                                <FormLabel >총 세트</FormLabel>
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
                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>무게(kg)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" min={0} {...field} type="number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="submit" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default PlanDialogForm;