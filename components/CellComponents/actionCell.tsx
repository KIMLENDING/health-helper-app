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

import TagSelector from "@/components/AdminComponents/addTag"
import { useDeleteExercise, useUpdateExercise } from "@/server/admin/mutations"

const ActionCell = ({ row }: { row: any }) => {
    const exercise = row.original
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [dbTags, setDbTags] = useState<string[]>(exercise.tags)
    const [formData, setFormData] = useState({
        title: exercise.title,
        tags: dbTags.join(", "), // 폼에서 태그를 콤마로 구분된 문자열로 표시
        url: exercise.url,
    })
    // useMutation 설정 (수정, 삭제)
    const useDeleteMutation = useDeleteExercise();
    const updateExercise = useUpdateExercise();

    // 폼 데이터 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handleTagChanges = useCallback(() => {
        setFormData((prev) => ({ ...prev, tags: dbTags.join(", ") }))
    }, [dbTags]);

    // 수정 버튼 클릭 시 호출되는 핸들러
    const handleEdit = async () => {
        const updatedTags = formData.tags.split(",").map((tag) => tag.trim())
        await updateExercise.mutateAsync({ _id: exercise._id, title: formData.title, tags: updatedTags, url: formData.url })
        setDialogOpen(false) // 다이얼로그 닫기
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
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            setDropdownOpen(false); // 먼저 DropdownMenu 닫고
                            setDialogOpen(true);    // 그리고 Dialog 열기
                        }}
                    >Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent >
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