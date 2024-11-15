"use client"

import { useEffect, useState } from "react"
import { ColumnDef, FilterFn } from "@tanstack/react-table"
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
import { ArrowUpDown } from "lucide-react"
import TagSelector from "@/components/AdminComponents/addTag"
import { Checkbox } from "@/components/ui/checkbox"
import { Exercise } from "@/utils/util"


// const filterTags: FilterFn<Exercise> = (row, columnId, filterValue) => {
//     const tags = row.getValue(columnId) as string[]
//     return tags.some((tag) => tag.toLowerCase().includes(filterValue.toLowerCase()))
// }
const filterTags: FilterFn<Exercise> = (row, columnId, filterValues) => {
    const tags = row.getValue(columnId) as string[]
    // 선택된 태그 중 하나라도 포함되면 true 반환
    const result = filterValues.length === 0 || filterValues.some((filterValue: string) => tags.includes(filterValue))
    return result
}

// 컬럼 정의
export const columns: ColumnDef<Exercise>[] = [
    {
        id: "select",
        header: ({ table }) => (
            // <Checkbox
            //     checked={
            //         table.getIsAllPageRowsSelected() || // 모든 페이지의 행이 선택되었는지 확인
            //         (table.getIsSomePageRowsSelected() && "indeterminate") // 일부 페이지의 행이 선택되었는지 확인
            //     }
            //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} // 모든 페이지의 행 선택/해제
            //     aria-label="Select all"
            // />
            <Checkbox
                checked={false} // 전체 선택 체크박스를 비활성화 상태로 설정
                onCheckedChange={() => { }} // 전체 선택 기능을 비활성화
                aria-label="Select all"
                disabled // 선택 비활성화를 위해 추가
            />
        ),
        cell: ({ row, table }) => (
            // <Checkbox // 각 행의 선택 체크박스
            //     checked={row.getIsSelected()} // 각 행이 선택되었는지 확인
            //     onCheckedChange={(value) => row.toggleSelected(!!value)} //각 행 선택/해제
            //     aria-label="Select row"
            // />
            // <Checkbox // 패이지당 한개의 행만 선택 가능하도록 설정
            //     checked={row.getIsSelected()}
            //     onCheckedChange={(value) => {
            //         // 모든 행의 선택 상태를 초기화
            //         table.getRowModel().rows.forEach((r) => r.toggleSelected(false));
            //         // table.getRowModel() 은 현재 페이지의 모든 행을 반환 즉 보이는 행에 대해서만 작동함
            //         // 현재 행만 선택
            //         row.toggleSelected(!!value);
            //     }}
            //     aria-label="Select row"
            // />
            <Checkbox // 전체 table중 한개의 행만 선택 가능하도록 설정
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    // 현재 선택된 행이 있는지 확인
                    const selectedRows = table.getSelectedRowModel().rows; // 모든 선택된 행을 반환

                    // 이미 선택된 행이 있으면 모든 선택을 해제
                    if (selectedRows.length > 0) {
                        selectedRows.forEach((selectedRow) => selectedRow.toggleSelected(false));
                    }

                    // 현재 선택한 행을 선택 상태로 설정
                    row.toggleSelected(!!value);
                }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "tags",
        header: "Tags",
        filterFn: filterTags, // 커스텀 필터 함수 적용
        cell: ({ getValue }) => (getValue() as string[]).sort().join(", "), // 배열을 콤마로 구분된 문자열로 표시
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
                console.log(name, value)
                setFormData((prev) => ({ ...prev, [name]: value }))
            }
            const handleTagChanges = () => {
                setFormData((prev) => ({ ...prev, tags: dbTags.join(", ") }))
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
            useEffect(() => {
                handleTagChanges()
            }, [dbTags])
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
        },
    },
]
