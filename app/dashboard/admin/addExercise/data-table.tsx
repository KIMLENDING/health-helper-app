"use client"

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    getPaginationRowModel,
    VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Settings2Icon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useSelectedExercise } from "@/server/mutations"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[] // 컬럼 정의
    data: TData[] // 데이터
}
const availableTags = ["상체", "하체", "가슴", "등", "어깨", "팔", "허벅지", "종아리",]
export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const { data: session } = useSession();
    const [sorting, setSorting] = useState<SortingState>([{ id: "title", desc: false }]) // 정렬 상태
    const [rowSelection, setRowSelection] = useState({}) // 행 선택 상태
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // 컬럼 필터 상태 
    const [selectedTags, setSelectedTags] = useState<string[]>([]) // 체크된 태그만 모아둔 상태 이걸 columFilters로 넘겨줘야함 넘겨주는 방법은 setFilterValue(값)을 호출하면 됨
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({ tags: true, url: true, title: true, actions: false }) // 컬럼 가시성 상태
    const toggleTagSelection = (tag: string) => { // 태그 필터링 체크박스 선택 토글
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((t) => t !== tag) // 이미 선택된 태그는 제외
                : [...prevSelectedTags, tag] // 새 태그 추가
        )
    }

    const useSelectedExerciseMutation = useSelectedExercise(); //  선택된 운동을 서버에 저장하는 뮤테이션 훅

    useEffect(() => {
        if (session?.user?.role === "admin") {
            setColumnVisibility({ tags: true, url: true, title: true, actions: true }) // 관리자만 보이는 컬럼 추가
        }
    }, [session])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(), // 기본 테이블 모델
        onSortingChange: setSorting, // 정렬 변경 useState
        getSortedRowModel: getSortedRowModel(), // 정렬 활성화
        onColumnFiltersChange: setColumnFilters, // 컬럼 필터 변경 useState
        getFilteredRowModel: getFilteredRowModel(), // 필터링 활성화
        onColumnVisibilityChange: setColumnVisibility, // 컬럼 가시성 변경 useState 
        getPaginationRowModel: getPaginationRowModel(), // 페이지네이션 활성화
        onRowSelectionChange: setRowSelection, // 행 선택 변경 useState
        state: { // useState 변수
            sorting, // 정렬 적용
            columnFilters, // 모든 컬럼에 대한 필터링 적용
            columnVisibility, // 컬럼 가시성 적용
            rowSelection, // 행 선택 적용
        },
        initialState: { pagination: { pageSize: 5 } }, // 초기 페이지 크기를 5로 설정
    })

    // 초기 랜더링시 데이터를 받아와서 rowSelection에 넣어줌
    useEffect(() => {

    }, [])



    useEffect(() => { // 선택된 행이 변경될 때마다 실행
        const selectedRows = Object.keys(rowSelection).map((key) => data[+key]) // 선택된 행의 key는 data의 인덱스임으로 
        useSelectedExerciseMutation.mutate(selectedRows) // 선택된 행의 데이터
    }, [rowSelection])



    /**
     *     console.log(data)
     * console.log(rowSelection)
     * 이거 거가지고 선택된 데이터를 어떻게 처리할지 생각해보기
     */
    useEffect(() => { // selectedTags 값이 변경될 때마다 태그 필터링 적용
        table.getColumn("tags")?.setFilterValue(selectedTags) // 태그 필터링 적용
        /**
      * setFilterValue(값)을 사용하면 columnFilters에 값이 들어가게 됨 이걸로 필터링을 적용함 
      * 즉 columnFilters가 모든 컬럼에 대한 필터링을 관리하는 변수임
     
      * 예시  이런식으로 columnFilters에 값이 들어가게 됨
      * columnFilters = [
         {
             "id": "tags",
             "value": [
                 "가슴"
             ]
         },
         {
             "id": "title",
             "value": "ㄹ"
         }
     ]
      */
    }, [selectedTags, table])
    return (
        <div className="min-h-min w-full" >
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} 개의 항목 중{" "}
                {table.getFilteredSelectedRowModel().rows.length} 선택됨
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="운동 이름으로 검색"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Settings2Icon />
                            태그
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {availableTags.map((tag) => (
                            <DropdownMenuCheckboxItem
                                key={tag}
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => { toggleTagSelection(tag) }}
                            >
                                {tag}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    결과 값이 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="mr-1"
                    >
                        이전
                    </Button >
                    {table.getState().pagination.pageIndex + 1}{' '}/{' '}{table.getPageCount()}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="ml-1"
                    >
                        다음
                    </Button>
                </div>
            </div>
        </div>
    )
}
