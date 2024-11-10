"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Link as LinkIcon, MoreHorizontal } from "lucide-react"
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
import Link from 'next/link'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDeleteExercise } from "@/server/mutations"
import { toast } from "@/hooks/use-toast"

// Exercise 타입 정의
export type Exercise = {
    _id: string
    title: string
    description: string
    url: string
    tags: string[]
}

// 컬럼 정의
export const columns: ColumnDef<Exercise>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ getValue }) => (getValue() as string[]).join(", "), // 배열을 콤마로 구분된 문자열로 표시
    },
    {
        accessorKey: "url",
        header: "참고 URL",
        cell: ({ row }) => {
            const exercise = row.original;
            return (
                <Link href={exercise.url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon />
                </Link>


            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const exercise = row.original
            const queryClient = useQueryClient()
            const [isDialogOpen, setDialogOpen] = useState(false)
            const [formData, setFormData] = useState({
                title: exercise.title,
                tags: exercise.tags.join(", "), // 폼에서 태그를 콤마로 구분된 문자열로 표시
                url: exercise.url,
            })
            const useDeleteMutation = useDeleteExercise();

            // 데이터 업데이트를 위한 useMutation 설정
            const { mutate: updateExercise } = useMutation(
                {
                    mutationFn: async (updatedData: Partial<Exercise>) => {
                        const response = await fetch(`/api/admin/exercise/${exercise._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updatedData),
                        })
                        if (!response.ok) {
                            throw new Error("Failed to update exercise")
                        }
                        return response.json()
                    },
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["exercises"] }) // 데이터 갱신 후 자동으로 UI 업데이트
                        setDialogOpen(false) // 모달 닫기
                    },
                },
            )

            // 폼 데이터 변경 핸들러
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target
                setFormData((prev) => ({ ...prev, [name]: value }))
            }

            // 수정 버튼 클릭 시 호출되는 핸들러
            const handleEdit = () => {
                const updatedTags = formData.tags.split(",").map((tag) => tag.trim())
                updateExercise({ _id: exercise._id, title: formData.title, tags: updatedTags, url: formData.url })
            }

            const handleDelete = async () => {
                const state = await useDeleteMutation.mutateAsync(exercise._id)
                toast({ variant: "default", title: state.message })
            }
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
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
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
        },
    },
]
