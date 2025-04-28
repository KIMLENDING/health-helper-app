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



import LoadingOverlay from "./LoadingOverlay"
import { useInProgress } from "@/server/user/exerciseSession/queries"
import { useCreateExerciseSession } from "@/server/user/exerciseSession/mutations"

type Props = {
    children: React.ReactNode;
    planId: string;
}

/** 진행할 플랜을 시작하거나 진행중인 운동 페이지로 이동시키는 버튼*/
export function DrawerDialogDemo({ children, planId }: Props) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const { data: inProgress } = useInProgress(); // ✅ 진행중인 운동 세션 조회
    const { latestSessionId } = inProgress || {}; // ✅ 진행중인 운동 세션 ID
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { mutateAsync, isPending } = useCreateExerciseSession();
    const [isLoading, setLoading] = React.useState(false);

    const handleStartSession = async () => {
        if (!planId) return;
        setLoading(true);
        try {
            const data = { planId };
            const res = await mutateAsync(data);
            if (res) router.push(`/dashboard/exerciseSession/${res.newExerciseSession._id}`);
        } catch (error) {
            console.error("운동 세션 시작 중 오류 발생:", error);
        } finally {
            setLoading(false); // 로딩 상태 초기화
            setOpen(false);
        }
    };

    /** 진행 중인 운동으로 이동  */
    const handleContinueSession = () => {
        if (!inProgress) return;
        setLoading(true);
        try {
            router.push(`/dashboard/exerciseSession/${latestSessionId}`);
        } catch (error) {
            console.error("운동 세션 이동 중 오류 발생:", error);
        } finally {
            setLoading(false); // 로딩 상태 초기화
            setOpen(false);
        }
    };

    const ActionButtons = (
        <div className="w-full flex gap-2" >
            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" variant="secondary">
                취소
            </Button>
            <Button
                className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                variant="secondary"
                onClick={latestSessionId ? handleContinueSession : handleStartSession}
                disabled={isPending} // ✅ 버튼 중복 클릭 방지
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
    if (isLoading) return <LoadingOverlay isLoading={isLoading} text={'로딩 중'} />; // ✅ 로딩 오버레이
    return (
        <>
            <UI.Root autoFocus open={open} onOpenChange={setOpen}>
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
            {isPending && <LoadingOverlay isLoading={isPending} text={'로딩 중'} />} {/* ✅ 로딩 오버레이 */}
        </>
    );
}
