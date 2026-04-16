"use client"

import React, { useState, useEffect } from "react"
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
    SearchIcon,
    FilterIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleIcon,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    /** 테이블 제목 (기본값: '목록') */
    title?: string
    /** 제목 옆 아이콘 */
    titleIcon?: React.ReactNode
    /** 텍스트 검색 컬럼 키 (기본값: 'title') */
    filterKey?: string
    /** 태그 필터 목록 (없으면 태그 필터 UI 비노출) */
    availableTags?: string[]
    /** 행 선택 변경 시 호출 (선택된 행의 원본 데이터 배열 전달) */
    onRowSelectionChange?: (selectedRows: TData[]) => void
    /** admin 컬럼 보이기 여부 (기본값: session role로 자동 결정) */
    showAdminColumns?: boolean
}

// 데이터 테이블 컴포넌트 정의
const DataTableComponent = <TData, TValue>({
    columns,
    data,
    title = '목록',
    titleIcon,
    filterKey = 'title',
    availableTags,
    onRowSelectionChange,
    showAdminColumns,
}: DataTableProps<TData, TValue>) => {
    const { data: session } = useSession()
    const [sorting, setSorting] = useState<SortingState>([{ id: filterKey, desc: false }])
    const [rowSelection, setRowSelection] = useState({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        tags: true,
        url: true,
        title: true,
        actions: false,
    })

    const toggleTagSelection = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    // admin 컬럼 가시성: showAdminColumns prop 우선, 없으면 session role로 결정
    useEffect(() => {
        const isAdmin = showAdminColumns ?? session?.user?.role === "admin"
        if (isAdmin) {
            setColumnVisibility({ tags: true, url: true, title: true, actions: true })
        }
    }, [session, showAdminColumns])

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

    // 행 선택 변경 시 외부로 위임
    useEffect(() => {
        if (!onRowSelectionChange) return
        const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original)
        onRowSelectionChange(selectedRows)
    }, [rowSelection])

    // 태그 필터 적용
    useEffect(() => {
        if (!availableTags) return
        table.getColumn("tags")?.setFilterValue(selectedTags)
    }, [selectedTags, table, availableTags])

    return (
        <div className="py-2 dark:bg-zinc-950 border-muted shadow-sm">
            {/* 헤더 */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {titleIcon}
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 break-keep">{title}</h2>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                        <span className="dark:text-gray-400">
                            {table.getFilteredRowModel().rows.length}개 중{" "}
                            <span className="font-medium text-green-600">
                                {table.getFilteredSelectedRowModel().rows.length}개
                            </span>{" "}
                            선택됨
                        </span>
                    </div>
                </div>
            </div>

            {/* 검색 & 태그 필터 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={`${title} 검색`}
                        value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn(filterKey)?.setFilterValue(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {availableTags && availableTags.length > 0 && (
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
                                    onCheckedChange={() => toggleTagSelection(tag)}
                                    className="cursor-pointer"
                                >
                                    {tag}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* 테이블 */}
            <div className="rounded-md border-2 overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-black dark:text-white flex items-center justify-center"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    className={row.getIsSelected() ? "bg-blue-50" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                "flex items-center justify-start",
                                                cell.column.id === "title" && "w-[140px]",
                                                cell.column.id === "tags" && "w-full",
                                            )}
                                        >
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

            {/* 페이지네이션 */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2 text-sm">
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

// 성능 최적화를 위해 React.memo로 감싸서 export
export const DataTable = React.memo(DataTableComponent) as typeof DataTableComponent