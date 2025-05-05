
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { CardContent, } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ExerciseOption } from "@/utils/util";

const formSchema = z.object({
    sets: z.number({ invalid_type_error: "숫자를 입력해주세요" }).min(1, "1 이상의 숫자를 입력해주세요"),
    reps: z.number({ invalid_type_error: "숫자를 입력해주세요" }).min(1, "1 이상의 숫자를 입력해주세요"),
    weight: z.number({ invalid_type_error: "숫자를 입력해주세요" }).min(1, "1 이상의 숫자를 입력해주세요"),
})
const PlanDialogForm = ({ item, SetState }: { item: ExerciseOption, SetState: React.Dispatch<React.SetStateAction<ExerciseOption[]>> }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sets: item?.sets,
            reps: item?.reps,
            weight: item?.weight,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // 각 Card의 제출 데이터를 처리하는 로직
        const newData =
        {
            sets: data.sets,
            reps: data.reps,
            weight: data.weight,
        } // 사용가가 원하는 값으로 업데이트를 위한 값 

        SetState(prevState => { // 옵션 데이터를 업데이트합니다.
            // 초기값 수정 
            return prevState.map(exercise => {
                if (exercise.exerciseId === item.exerciseId) {
                    // exerciseId가 일치하는 경우에만 업데이트합니다. (선택된 컴포턴트)
                    return { exerciseId: exercise.exerciseId, title: exercise.title, ...newData } // 기존 데이터에 새로운 데이터를 덮어씌웁니다.
                } else {
                    return exercise // 기존 데이터를 그대로 반환합니다.
                }
            })
        });
    };

    return (
        <Dialog key={item.exerciseId} >
            <DialogTrigger asChild>
                <Button >
                    {item && '상세 설정'}
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg">
                <DialogHeader>
                    <DialogTitle className="pb-2">{item.title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <CardContent className="px-4 py-2 bg-background ">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="sets"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel >총 세트</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1" min={1} {...field} type="number" />
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
                                                <Input placeholder="1" min={1} {...field} type="number" />
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
                                                <Input placeholder="1" min={1} {...field} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <Button type="submit" variant="secondary">
                                            저장
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </Form>
                    </CardContent>

                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default PlanDialogForm;