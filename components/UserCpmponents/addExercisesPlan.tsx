import { getSelectedExercises } from '@/server/queries';
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import GetExercise from '../AdminComponents/getExercise';
import { XIcon } from 'lucide-react';
import PlanDialogForm from './planForm';
import { Exercise, ExerciseOption } from '@/utils/util';
import { toast } from '@/hooks/use-toast';
import { useUpdatePlan } from '@/server/mutations';
import { useQueryClient } from '@tanstack/react-query';


const AddExercisesPlan = ({ plan_id }: { plan_id: string }) => {

    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [planData, setPlanData] = useState<Exercise[]>([]) // 가져온 운동 종목 데이터를 저장하는 변수
    const [exerciseOption, setExerciseOption] = useState<ExerciseOption[]>([]) // 이건 세트, 반복횟수, 휴식시간을 저장하는 변수
    const { data, error, isLoading } = getSelectedExercises(); // 필요한 운동 종목 데이터를 가져옵니다.
    const useUpdatePlanMutation = useUpdatePlan();
    const queryClient = useQueryClient();
    console.log(isOpen)
    useEffect(() => { // 데이터가 있으면 planData에 추가합니다.
        if (data) {
            setPlanData(prevState => { // 중복된 데이터를 제거합니다.
                const newState = new Map();

                // 기존 상태의 아이템들을 Map에 넣어서 중복 제거
                prevState.forEach(exercise => newState.set(exercise._id, exercise));

                // 새로 들어온 데이터를 Map에 추가 (중복되면 덮어씀)
                data.forEach(exercise => newState.set(exercise._id, exercise));

                // Map의 값들만 추출하여 배열로 반환
                return Array.from(newState.values());
            });
        }
    }, [data])



    useEffect(() => {
        console.log('useEffect')
        if (planData.length !== 0 && exerciseOption.length !== 0) {
            console.log('useEffect1')
            if (planData.length === exerciseOption.length) {
                console.log('운동 추가')
                setIsSave(true)
            }
        }
    }, [planData, exerciseOption])
    const handleUpdate = async () => {
        if (planData.length === 0) {
            return toast({ variant: 'default2', title: '운동을 추가해 주세요' });
        }
        else if (exerciseOption.length === 0) {
            return toast({ variant: 'default2', title: 'sets, reps, rest를 설정해주세요' });
        }
        else if (planData.length !== exerciseOption.length) {
            console.log(planData.length, exerciseOption.length)
            return toast({ variant: 'default2', title: '추가 할 운동 중 sets, reps, rest가 설정되지 않는 운동이 있습니다.' });
        }
        else if (session?.user._id) {
            const newUpdataData = {
                userId: session?.user._id!,
                title: '', // 이건 인터페이스에 있지만 여기서는 사용하지 않기때문에 빈값으로 넣어줍니다.
                exercisePlanId: plan_id,
                exercises: exerciseOption,
                type: 'add',
            }
            const res = await useUpdatePlanMutation.mutateAsync(newUpdataData);
            if (res) {

                setExerciseOption([])
                setPlanData([])
                setIsOpen(false)
                setIsSave(false)
                queryClient.resetQueries({ queryKey: ["selectedExercise"] }); // 캐시된 데이터를 초기화합니다.
                // 초기화를 안하면 PlanData에 데이터가 계속 쌓이게 됨

            }
        }
    }

    const handleDelete = (id: string) => {
        // 삭제 로직
        // 운동 종목 삭제
        setPlanData(prevState => prevState.filter(exercise => exercise._id !== id)) // 삭제할 데이터를 제외한 나머지 데이터를 반환합니다.
        // 상세 데이터 삭제 - 세트, 반복횟수, 휴식시간 , exerciseId
        setExerciseOption(prevState => prevState.filter(exercise => exercise.exerciseId !== id)) // 삭제할 데이터를 제외한 나머지 데이터를 반환합니다.
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <Button >운동 추가 </Button>
            </DialogTrigger>
            <DialogContent className='p-0 border-0 bg-transparent rounded-lg'>
                {/* <DialogHeader> */}
                <DialogTitle className=' hidden'></DialogTitle>
                <DialogDescription className='hidden'></DialogDescription>
                <div className="mx-auto  min-h-min w-full max-w-3xl rounded-xl bg-muted/50" >
                    <Card>
                        <CardHeader >
                            <div className='space-y-8 m-4'>
                                <div className='flex justify-between'>

                                    <CardTitle className='flex items-center'>운동 추가</CardTitle>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button >추가</Button>
                                        </DialogTrigger>
                                        <DialogContent className='p-0 border-0 bg-transparent rounded-lg'>
                                            {/* <DialogHeader> */}
                                            <DialogTitle className=' hidden'></DialogTitle>
                                            <DialogDescription className='hidden'></DialogDescription>
                                            <GetExercise />
                                            {/* </DialogHeader> */}
                                            <DialogFooter className="sm:justify-start">
                                                {/* <DialogClose asChild>
                                                    <Button type="button" variant="secondary">
                                                        Close
                                                    </Button>
                                                </DialogClose> */}
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div>
                                    <CardContent className='rounded-md shadow-inner bg-zinc-300 dark:bg-zinc-800 my-4'>
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

                                                            <PlanDialogForm item={item} key={item._id} SetState={setExerciseOption} state={exerciseOption.find((v) => v.exerciseId === item._id)} />
                                                        </CardHeader>
                                                    </Card>
                                                )) : <div className='pt-6 flex justify-center items-center'> 루틴을 추가하세요</div>}
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </div>
                        </CardHeader>

                    </Card>
                </div>


                {/* </DialogHeader> */}
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={handleUpdate} disabled={!isSave}>
                            save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default AddExercisesPlan