"use client"

import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Exercise } from "@/utils/util"
import ActionCell from "@/components/CellComponents/actionCell"


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
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() || // 모든 페이지의 행이 선택되었는지 확인
                    (table.getIsSomePageRowsSelected() && "indeterminate") // 일부 페이지의 행이 선택되었는지 확인
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} // 모든 페이지의 행 선택/해제
                aria-label="Select all"
            />

        ),
        cell: ({ row, table }) => {
            return (
                <Checkbox // 각 행의 선택 체크박스
                    checked={row.getIsSelected()} // 각 행이 선택되었는지 확인
                    onCheckedChange={(value) => row.toggleSelected(!!value)} //각 행 선택/해제
                    aria-label="Select row"
                />
            )
        }
        ,
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
        cell: ({ getValue }) => {
            const tags = getValue() as string[]
            tags.join(", ")
            return (
                <div className="overflow-y-scroll text-ellipsis max-h-16 scrollbar-hide">{tags.join(", ")}</div>
            )
        }
    },
    // {
    //     accessorKey: "url",
    //     header: "참고 URL",
    //     cell: ({ row }) => {
    //         const exercise = row.original;
    //         return (
    //             <Link href={exercise.url} target="_blank" rel="noopener noreferrer">
    //                 <LinkIcon />
    //             </Link>
    //         );
    //     },
    // },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell row={row} />
    },
]
