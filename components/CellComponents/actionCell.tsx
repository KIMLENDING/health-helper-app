"use client"

import { useCallback, useEffect, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDeleteExercise } from "@/server/mutations"
import { toast } from "@/hooks/use-toast"
import TagSelector from "@/components/AdminComponents/addTag"
import { Exercise } from "@/utils/util"

const ActionCell = ({ row }: { row: any }) => {
    const exercise = row.original
    const queryClient = useQueryClient()
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [dbTags, setDbTags] = useState<string[]>(exercise.tags)
    const [formData, setFormData] = useState({
        title: exercise.title,
        tags: dbTags.join(", "), // 폼에서 태그를 콤마로 구분된 문자열로 표시
        url: exercise.url,
    })
    const useDeleteMutation = useDeleteExercise();
    // 데이터 업데이트를 위한 useMutation 설정
    const { mutate: updateExercise } = useMutation(
        {
            mutationFn: async (updatedData: Partial<Exercise>) => {
                const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/exercise/${exercise._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData),
                })
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                return response.json()
            },
            onSuccess: (data) => {
                console.log("onSuccess", data)
                toast({ variant: "default2", title: `${data.message}` })
                queryClient.invalidateQueries({ queryKey: ["exercises"] }) // 데이터 갱신 후 자동으로 UI 업데이트
                setDialogOpen(false) // 모달 닫기
            },
            onError: (error) => {
                console.log("onError", error)
                toast({ variant: "destructive", title: `${error}` })
            }
        },
    )

    // 폼 데이터 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        console.log(name, value)
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handleTagChanges = useCallback(() => {
        setFormData((prev) => ({ ...prev, tags: dbTags.join(", ") }))
    }, [dbTags]);

    // 수정 버튼 클릭 시 호출되는 핸들러
    const handleEdit = () => {
        const updatedTags = formData.tags.split(",").map((tag) => tag.trim())
        updateExercise({ _id: exercise._id, title: formData.title, tags: updatedTags, url: formData.url })
    }

    const handleDelete = () => {
        useDeleteMutation.mutate(exercise._id)
    }
    useEffect(() => {
        handleTagChanges()
    }, [dbTags, handleTagChanges])
    return (
        <>
            {/* DropdownMenu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {/* <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(exercise._id)}
                    >
                        Copy Exercise ID
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Exercise</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            aria-label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <Input
                            aria-label="Tags (comma separated)"
                            name="tags"
                            value={dbTags}
                            disabled
                        />
                        <TagSelector dbTags={dbTags} setDbTags={setDbTags} />
                        <Input
                            aria-label="URL (comma separated)"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ActionCell