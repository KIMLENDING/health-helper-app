'use client'
import * as React from "react"
import { useRouter } from "next/navigation"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose,
} from "@/components/ui/dialog"
import {
    Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose,
} from "@/components/ui/drawer"

import { ExercisePlan } from "@/utils/util"
import { useCreateExerciseSession } from "@/server/mutations"
import { useInProgress } from "@/server/queries"

type Props = {
    children: React.ReactNode;
    plan: ExercisePlan;
}

export function DrawerDialogDemo({ children, plan }: Props) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const { data: inProgress } = useInProgress();
    const { latestSessionId } = inProgress || {};
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { mutateAsync } = useCreateExerciseSession();

    const handleStartSession = async () => {
        const { exercises, _id, userId } = plan as any;
        const newSession = {
            userId,
            exercisePlanId: _id,
            state: 'inProgress',
            exercises: exercises.map((ex: any) => {
                const { _id, ...rest } = ex;
                return { ...rest, state: 'pending' };
            }),
        };
        const res = await mutateAsync(newSession);
        if (res) router.push(`/dashboard/exerciseSession/${res.newExerciseSession._id}`);
    };

    /** 진행 중인 운동으로 이동  */
    const handleContinueSession = () => {
        if (!inProgress) return;
        router.push(`/dashboard/exerciseSession/${latestSessionId}`);
    };

    const ActionButtons = (
        <div className="w-full flex gap-2">
            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" variant="secondary">
                취소
            </Button>
            <Button
                className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                variant="secondary"
                onClick={latestSessionId ? handleContinueSession : handleStartSession}
            >
                예
            </Button>
        </div>
    );

    const Title = latestSessionId ? "현재 진행 중인 운동이 있습니다." : "운동을 시작하시겠습니까?";
    const Description = latestSessionId
        ? "진행 중인 운동으로 이동하시겠습니까?"
        : "운동을 시작하면 운동에 집중해 주세요.";

    const UI = isDesktop ? {
        Root: Dialog,
        Trigger: DialogTrigger,
        Content: DialogContent,
        Header: DialogHeader,
        Footer: DialogFooter,
        Title: DialogTitle,
        Description: DialogDescription,
        Close: DialogClose,
    } : {
        Root: Drawer,
        Trigger: DrawerTrigger,
        Content: DrawerContent,
        Header: DrawerHeader,
        Footer: DrawerFooter,
        Title: DrawerTitle,
        Description: DrawerDescription,
        Close: DrawerClose,
    };

    return (
        <UI.Root open={open} onOpenChange={setOpen}>
            <UI.Trigger asChild>
                <div className="flex flex-row gap-2">{children}</div>
            </UI.Trigger>
            <UI.Content className={isDesktop ? "sm:max-w-[425px]" : ""}>
                <UI.Header className={isDesktop ? "" : "text-left"}>
                    <UI.Title className={latestSessionId ? "text-red-300" : ""}>{Title}</UI.Title>
                    <UI.Description>{Description}</UI.Description>
                </UI.Header>
                <UI.Footer className="pt-2">
                    <UI.Close asChild>
                        {ActionButtons}
                    </UI.Close>
                </UI.Footer>
            </UI.Content>
        </UI.Root>
    );
}
