import React, { useEffect, useState } from "react";
import { CardContent } from "../ui/card";
import { ClockIcon, DumbbellIcon, HamIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { ExerciseOption, ExercisePlan } from "@/utils/util";
import { Button } from "../ui/button";
import ExerciseOptin from "./exerciseOptin";
import { useDeletePlan } from "@/server/mutations";
import AddExercisesPlan from "./addExercisesPlan";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";


const ExercisesWithPagination = ({ plan }: { plan: ExercisePlan }) => {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const exercisesPerPage = 3; // 페이지당 보여줄 운동 개수
    const useDeletePlanMutation = useDeletePlan();

    // 페이지네이션에 필요한 계산
    const totalPages = Math.ceil(plan.exercises.length / exercisesPerPage); // 전체 페이지 수
    const currentExercises = plan.exercises.slice( // 현재 페이지에 보여줄 운동
        (currentPage - 1) * exercisesPerPage, // 시작 인덱스
        currentPage * exercisesPerPage // 끝 인덱스
    );
    useEffect(() => {
        // 첫 페이지 가 아닐 때 페이지가 총 페이지보다 크면 마지막 페이지로 이동
        // (마지막페이지에서 운동 삭제시 페이지가 사라짐으로 ui업데이트) 
        if (currentPage !== 1 && totalPages < currentPage) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]); // 페이지가 변경될 때마다 실행

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleDelete = (exercise: ExerciseOption) => {
        const deleteExercise = {
            exercisePlanId: plan._id!,
            exerciseId: exercise._id!,
        }
        useDeletePlanMutation.mutate(deleteExercise);
    }
    return (
        <CardContent className="space-y-4">
            {currentExercises.map((exercise) => (
                <div key={exercise.exerciseId} className="border rounded p-4 group hover:bg-zinc-200 dark:hover:bg-zinc-900">
                    <div className="flex items-center gap-2 mb-3 justify-between h-6">
                        <div className="flex flex-row gap-2">
                            <DumbbellIcon className="w-6 h-6" />
                            <h3 className="font-semibold">{exercise.title}</h3>
                        </div>
                        <div className="gap-2 flex-row transition-opacity duration-300 opacity-0 flex group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none">
                            <ExerciseOptin plan={plan} exercise={exercise} />
                            {/* <Button variant='outline' onClick={() => handleDelete(exercise)} className="border-0 h-6 ring-0 shadow-none ">
                                <Trash2Icon />
                            </Button> */}

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant='outline' className="border-0 h-6 ring-0 shadow-none ">
                                        <Trash2Icon />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>삭제하시겠습니까?</DialogTitle>
                                    </DialogHeader>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <div className="w-full flex gap-2">

                                                <Button className="flex-1" type="button" variant="secondary">
                                                    취소
                                                </Button>
                                                <Button className="flex-1 bg-red-600 text-white" type="button" variant="secondary" onClick={() => handleDelete(exercise)}>
                                                    삭제
                                                </Button>
                                            </div>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <span className="text-sm text-gray-500">Sets</span>
                            <p className="font-medium">{exercise.sets}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Reps</span>
                            <p className="font-medium">{exercise.reps}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Rest</span>
                            <div className="font-medium flex items-center max-sm:justify-center">
                                <ClockIcon className="w-4 h-4 mr-1" />
                                <p>{exercise.rest}s</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {(currentPage === totalPages || plan.exercises.length === 0) && <div>

                <AddExercisesPlan plan_id={plan._id!} />
            </div>}
            {/* 페이지네이션 버튼 */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className={`px-4 py-2 text-sm font-medium border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className={`px-4 py-2 text-sm font-medium border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    다음
                </button>
            </div>

        </CardContent>
    );
};

export default ExercisesWithPagination;
