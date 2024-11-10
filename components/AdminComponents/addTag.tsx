import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { tags } from '@/utils/util'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
interface TagSelectorProps {
    dbTags: string[];
    setDbTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagSelector({ dbTags, setDbTags }: TagSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    // const [dbTags, setDbTags] = useState<string[]>([]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const findParentTags = (targetTag: string) => {
        const parentTags: any = [];
        // 검색어의 상위 태그 찾기
        for (const [mainCategory, subCategories] of Object.entries(tags)) {
            for (const [subCategory, muscles] of Object.entries(subCategories)) {
                if (muscles.includes(targetTag)) { // 소분류 태그로 검색했을 때
                    return [mainCategory, subCategory];
                }
                if (subCategory === targetTag) { // 중분류 태그로 검색했을 때
                    return [mainCategory];
                }
            }
        }
        return parentTags;
    };

    const findChildTags = (targetTag: string) => {
        // 검색어의 하위 태그 찾기
        const childTags = [];
        if (targetTag in tags) {
            //targetTag가 대분류 태그인 경우  (상체, 하체)
            const mainCategory = tags[targetTag as keyof typeof tags];
            Object.entries(mainCategory).forEach(([subCategory, muscles]) => {
                childTags.push(subCategory, ...muscles);
            });
        } else {
            //targetTag가 중분류 태그인 경우 (팔, 어깨, 가슴, 등, 배, 엉덩이, 허벅지, 종아리)
            for (const subCategories of Object.values(tags)) {
                const subCategoriesObj = subCategories as { [key: string]: string[] };
                if (targetTag in subCategoriesObj) {
                    childTags.push(...subCategoriesObj[targetTag]);
                    break;
                }
            }
        }
        return childTags;
    };

    const toggleTag = (tag: string) => {
        setDbTags(prev => {
            if (prev.includes(tag)) {
                // 1. 먼저 현재 태그와 그 하위 태그들을 제거
                let newTags = prev.filter(t => t !== tag);
                const childTags = findChildTags(tag);
                newTags = newTags.filter(t => !childTags.includes(t));
                // 2. 상위 태그들 찾기
                const parentTags = findParentTags(tag);
                // 3. 각 상위 태그에 대해 다른 하위 태그가 있는지 확인
                parentTags.forEach((parentTag: string) => {
                    const allChildrenOfParent = findChildTags(parentTag);
                    // 현재 선택된 태그들 중에서 이 부모의 다른 하위 태그가 있는지 확인
                    const hasOtherChildren = allChildrenOfParent.some(child =>
                        newTags.includes(child)
                    );
                    // 다른 하위 태그가 없다면 상위 태그도 제거
                    if (!hasOtherChildren) {
                        newTags = newTags.filter(t => t !== parentTag);
                        // 상위 태그가 중분류인 경우, 대분류도 확인
                        if (parentTags.length > 1) {
                            const grandParent = parentTags[0]; // 대분류
                            const allChildrenOfGrandParent = findChildTags(grandParent);
                            const hasOtherGrandChildren = allChildrenOfGrandParent.some(child =>
                                newTags.includes(child)
                            );
                            if (!hasOtherGrandChildren) {
                                newTags = newTags.filter(t => t !== grandParent);
                            }
                        }
                    }
                });
                return newTags;
            } else {
                // 태그 추가 시 상위 태그들도 함께 추가
                const parentTags = findParentTags(tag);
                return [...new Set([...prev, tag, ...parentTags])];
            }
        });
    };

    const matchesSearch = (text: string) => {
        return text.toLowerCase().includes(searchTerm.toLowerCase());
    };

    // 태그 렌더링
    const renderTags = () => {
        return Object.entries(tags).map(([mainCategory, subCategories]) => {
            const mainMatches = matchesSearch(mainCategory);
            const hasMatchingChildren = Object.entries(subCategories).some(([subKey, values]) =>
                matchesSearch(subKey) || values.some(v => matchesSearch(v))
            );
            if (!searchTerm || mainMatches || hasMatchingChildren) {
                return (
                    <div key={mainCategory} className="mb-4">
                        <div
                            onClick={() => toggleTag(mainCategory)}
                            className={`cursor-pointer px-3 py-2 rounded-md mb-2 transition-colors ${dbTags.includes(mainCategory)
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-50 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {mainCategory}
                        </div>
                        <div className="ml-4">
                            {Object.entries(subCategories).map(([subCategory, muscles]) => {
                                const subMatches = matchesSearch(subCategory);
                                const hasMatchingMuscles = muscles.some(m => matchesSearch(m));
                                if (!searchTerm || subMatches || hasMatchingMuscles) {
                                    return (
                                        <div key={subCategory} className="mb-2">
                                            <div
                                                onClick={() => toggleTag(subCategory)}
                                                className={`cursor-pointer px-3 py-1 rounded-md mb-1 transition-colors ${dbTags.includes(subCategory)
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                    : 'bg-gray-50 hover:bg-gray-200 dark:bg-stone-900 dark:hover:bg-stone-800'
                                                    }`}
                                            >
                                                {subCategory}
                                            </div>
                                            <div className="ml-4 flex flex-wrap gap-2">
                                                {muscles.map(muscle => (
                                                    matchesSearch(muscle) || !searchTerm ? (
                                                        <span
                                                            key={muscle}
                                                            onClick={() => toggleTag(muscle)}
                                                            className={`cursor-pointer px-2 py-1 rounded-md text-sm transition-colors ${dbTags.includes(muscle)
                                                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                                : 'bg-gray-50 hover:bg-gray-200 dark:bg-zinc-900 dark:hover:bg-zinc-800'
                                                                }`}
                                                        >
                                                            {muscle}
                                                        </span>
                                                    ) : null
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button >운동 부위 태그 선택</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <Card className="w-full ">
                        <CardHeader>
                            <CardTitle>운동 부위 태그 선택</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="태그 검색..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">선택된 태그:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {dbTags.map(tag => (
                                        <span
                                            key={tag}
                                            className="group bg-blue-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-blue-600 transition-colors cursor-pointer"
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {tag}
                                            <X size={14} className="group-hover:scale-110 transition-transform" />
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t pt-4 max-h-[30vh] min-h-[30vh] overflow-y-scroll">
                                {renderTags()}
                            </div>
                        </CardContent>
                    </Card>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}