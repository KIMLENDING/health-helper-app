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

} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useDialogStore } from "@/store/dialogStore"

/** 
 * 전역 상태를 통해 다이얼로그를 표시/관리하는 컴포넌트
 * zustand store를 사용하여 모달 상태를 전역적으로 관리
 */
export default function DrawerDialogActionWithStore() {
    const {
        isOpen,
        title,
        description,
        closeDialog,
        confirmAction,
    } = useDialogStore();

    const isDesktop = useMediaQuery("(min-width: 768px)")

    const Title = title;
    const Description = description;
    const ActionButtons = (
        <div className="w-full flex gap-2">
            <Button
                className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                variant="secondary"
                onClick={closeDialog}
            >
                취소
            </Button>
            <Button
                className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600"
                variant="secondary"
                onClick={confirmAction}
            >
                예
            </Button>
        </div>
    )

    const UI = isDesktop ? {
        Root: Dialog,
        Content: DialogContent,
        Header: DialogHeader,
        Footer: DialogFooter,
        Title: DialogTitle,
        Description: DialogDescription,
        Close: DialogClose,
    } : {
        Root: Drawer,
        Content: DrawerContent,
        Header: DrawerHeader,
        Footer: DrawerFooter,
        Title: DrawerTitle,
        Description: DrawerDescription,
        Close: DrawerClose,
    };
    // 다이얼로그의 UI 컴포넌트 설정
    return (

        <UI.Root autoFocus open={isOpen} onOpenChange={closeDialog}>
            <UI.Content className={isDesktop ? "sm:max-w-[425px]" : ""}>
                <UI.Header className={isDesktop ? "" : "text-left"}>
                    <UI.Title className={"text-red-300"}>{Title}</UI.Title>
                    <UI.Description>{Description}</UI.Description>
                </UI.Header>
                <UI.Footer className="pt-2">
                    <UI.Close asChild>
                        {ActionButtons}
                    </UI.Close>
                </UI.Footer>
            </UI.Content>
        </UI.Root>
    )
}

/**
 * 사용 예시:
 * 
 * import { useDialogStore } from "@/store/dialogStore";
 * 
 * function SomeComponent() {
 *   const { openDialog } = useDialogStore();
 * 
 *   const handleDelete = () => {
 *     openDialog({
 *       title: "정말 삭제하시겠습니까?",
 *       description: "이 작업은 되돌릴 수 없습니다.",
 *       onConfirm: () => {
 *         // 삭제 로직 실행
 *         console.log("삭제 완료!");
 *       }
 *     });
 *   };
 * 
 *   return <Button onClick={handleDelete}>항목 삭제</Button>;
 * }
 */
