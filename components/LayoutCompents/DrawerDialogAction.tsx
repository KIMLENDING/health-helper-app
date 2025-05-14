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

/** action함수를 받아서 진행 시키기 전 모달을 띄워 다시 한 번 확인 하는 컴포넌트 */
export default function DrawerDialogAction({
    onAction, title, description, open, setOpen
}: Readonly<{
    // children: React.ReactNode;
    onAction: () => void;
    title?: string;
    description?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}>) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const Title = title || '운동을 종료 하시겠습니까?'
    const Description = description || '운동을 종료하면 종료한 운동은 다시 시작할 수 없습니다.'
    const ActionButtons = (
        <div className="w-full flex gap-2">
            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" variant="secondary">
                취소
            </Button>
            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" variant="secondary" onClick={onAction} >
                예
            </Button>
        </div>
    )

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

        <UI.Root autoFocus open={open} onOpenChange={setOpen}>
            <UI.Trigger asChild>
                {/* <div className="flex flex-row gap-2">{children}</div> */}
            </UI.Trigger>
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
 * Blocked aria-hidden on an element because its descendant retained focus. 
 * The focus must not be hidden from assistive technology users. 
 * Avoid using aria-hidden on a focused element or its ancestor.
 *  Consider using the inert attribute instead, which will also prevent focus. 
 * For more details, see the aria-hidden section of the WAI-ARIA specification at https://w3c.github.io/aria/#aria-hidden.
Element with focus: button

즉 보이지 못하는 곳에 포커스가 되어 있다는 소리임 
이게 자동으로 포커스를 맞춰주기 때문에 생기는 문제 인듯 그래서 autoFocus={false}를 넣어주면 해결됨
 */