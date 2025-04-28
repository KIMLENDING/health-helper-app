"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Settings2Icon,
    SearchIcon,
    FilterIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleIcon
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useSelectedExercise } from "@/server/mutations"
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

const availableTags = ["상체", "하체", "가슴", "등", "어깨", "팔", "허벅지", "종아리"]

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const { data: session } = useSession();
    const [sorting, setSorting] = useState<SortingState>([{ id: "title", desc: false }])
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        tags: true,
        url: true,
        title: true,
        actions: false
    })

    const useSelectedExerciseMutation = useSelectedExercise();

    const toggleTagSelection = (tag: string) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((t) => t !== tag)
                : [...prevSelectedTags, tag]
        )
    }

    useEffect(() => {
        if (session?.user?.role === "admin") {
            setColumnVisibility({ tags: true, url: true, title: true, actions: true })
        }
    }, [session])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: { pageSize: 5 },

        },
    })

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original)
        useSelectedExerciseMutation.mutate(selectedRows)
    }, [rowSelection])

    useEffect(() => {
        table.getColumn("tags")?.setFilterValue(selectedTags)
    }, [selectedTags, table])

    return (
        <div className="p-4 dark:bg-zinc-950 border-muted shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">운동 목록</h2>
                <div className="flex items-center text-sm text-gray-500">
                    <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                    <span className="dark:text-gray-400">
                        {table.getFilteredRowModel().rows.length}개 중 {" "}
                        <span className="font-medium text-green-600">
                            {table.getFilteredSelectedRowModel().rows.length}개
                        </span> 선택됨
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="운동 이름으로 검색"
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <FilterIcon className="h-4 w-4 mr-2" />
                            태그 필터
                            {selectedTags.length > 0 && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    {selectedTags.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2">
                        <div className="mb-2 px-2 py-1 text-sm font-medium text-black dark:text-white">태그 선택</div>
                        {availableTags.map((tag) => (
                            <DropdownMenuCheckboxItem
                                key={tag}
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => { toggleTagSelection(tag) }}
                                className="cursor-pointer"
                            >
                                {tag}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md  border-2  overflow-hidden">
                <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className=" text-black dark:text-white py-3"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={`
                                       
                                        ${row.getIsSelected() ? "bg-blue-50" : ""}
                                    `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500">
                                    결과 값이 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2 text-sm ">
                    <span>페이지 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="flex items-center border-gray-300 disabled:opacity-50"
                    >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        이전
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="flex items-center border-gray-300 disabled:opacity-50"
                    >
                        다음
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}