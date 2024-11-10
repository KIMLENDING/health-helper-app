"use client"

import { ColumnDef } from "@tanstack/react-table"
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
import { useState } from "react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Exercise = {
    _id: string
    title: string
    description: string
    url: string
    tags: string[]
}
export const columns: ColumnDef<Exercise>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ getValue }) => (getValue() as string[]).join(", "), // tags 배열을 문자열로 변환해 보여줌
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const exercise = row.original;
            const [isEditing, setIsEditing] = useState(false);
            const [newTitle, setNewTitle] = useState(exercise.title);
            const [newTags, setNewTags] = useState(exercise.tags.join(", "));

            const handleSave = async () => {
                try {
                    const response = await fetch(`/api/admin/exercise/${exercise._id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ title: newTitle, tags: newTags.split(", ") }),
                    });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                    const updatedExercise = await response.json();
                    console.log("Updated exercise:", updatedExercise);

                    // UI 업데이트 (React Query를 사용하는 경우 데이터를 리페치)
                    setIsEditing(false);
                } catch (error) {
                    console.error("error", error);
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(exercise._id)}>
                            Copy 운동 ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="New title"
                                    className="p-2 border"
                                />
                                <input
                                    type="text"
                                    value={newTags}
                                    onChange={(e) => setNewTags(e.target.value)}
                                    placeholder="New tags (comma separated)"
                                    className="p-2 border"
                                />
                                <Button onClick={handleSave} className="mt-2">
                                    저장
                                </Button>
                            </>
                        ) : (
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>수정</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];