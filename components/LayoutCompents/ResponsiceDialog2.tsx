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

export function DrawerDialogDone({ children,
    onComplete
}: Readonly<{
    children: React.ReactNode;
    onComplete: () => void;
}>) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex ">{children}</div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>운동을 종료 하시겠습니까?</DialogTitle>
                        <DialogDescription>
                            운동을 종료하면 종료한 운동은 다시 시작할 수 없습니다.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter >
                        <DialogClose asChild>
                            <div className="w-full flex gap-2">
                                <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary">
                                    취소
                                </Button>
                                <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary" onClick={onComplete} >
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
                <div className="flex ">{children}</div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>운동을 종료 하시겠습니까?</DrawerTitle>
                    <DrawerDescription>
                        운동을 종료하면 종료한 운동은 다시 시작할 수 없습니다.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <div className="w-full flex gap-2">
                            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary">
                                취소
                            </Button>
                            <Button className="flex-1 hover:bg-zinc-300 hover:dark:bg-zinc-600" type="button" variant="secondary" onClick={onComplete} >
                                예
                            </Button>
                        </div>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}


