'use client'
import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ExercisePlan } from "@/utils/util"
import { useCreateExerciseSession } from "@/server/mutations"
import { useRouter } from "next/navigation"


export function DrawerDialogDemo({ children,
    plan,
}: Readonly<{
    children: React.ReactNode;
    plan: ExercisePlan;
}>) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const useCreateSessionMutation = useCreateExerciseSession();
    const handleMutation = async (plan: ExercisePlan) => {
        // api 호출을 통해 세션을 생성하고 생성이 되면 세션의 id를 반환 받아서 페이지 이동
        const { exercises, _id, userId, ...rest } = plan as any;

        const newSession = { // 세션 생성
            userId: userId,
            exercisePlanId: _id,
            state: 'inProgress',
            exercises: exercises.map((exercise: { _id: string;[key: string]: any }) => {
                const { _id, ...rest } = exercise;
                return { ...rest, state: 'pending' };
            }),
        }
        const res = await useCreateSessionMutation.mutateAsync(newSession);
        if (res) {
            router.push(`/dashboard/exerciseSession/${res.newExerciseSession._id}`); // 세션 생성 후 세션 페이지로 이동
        }
    }
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex flex-row gap-2">{children}</div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>운동을 시작 하시겠습니까?</DialogTitle>
                        <DialogDescription>
                            운동을 시작하면 운동에 집중해 주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter >
                        <DialogClose asChild>
                            <div className="w-full flex gap-2">
                                <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary">
                                    취소
                                </Button>
                                <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary" onClick={() => handleMutation(plan)} >
                                    예
                                </Button>
                            </div>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="flex flex-row gap-2">{children}</div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>운동을 시작 하시겠습니까?</DrawerTitle>
                    <DrawerDescription>
                        운동을 시작하면 운동에 집중해 주세요.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <div className="w-full flex gap-2">
                            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary">
                                취소
                            </Button>
                            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary" onClick={() => handleMutation(plan)}>
                                예
                            </Button>
                        </div>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}


