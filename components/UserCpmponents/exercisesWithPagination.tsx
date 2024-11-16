import React, { useState } from "react";
import { CardContent } from "../ui/card";
import { ClockIcon, DumbbellIcon, HamIcon, MoreHorizontal } from "lucide-react";
import { ExerciseOption, ExercisePlan } from "@/utils/util";
import { Button } from "../ui/button";
import ExerciseOptin from "./exerciseOptin";
import { useDeletePlan } from "@/server/mutations";


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
        console.log(deleteExercise)

    }
    return (
        <CardContent className="space-y-4">
            {currentExercises.map((exercise) => (
                <div key={exercise.exerciseId} className="border rounded p-4 ">
                    <div className="flex items-center gap-2 mb-3 justify-between">
                        <div className="flex flex-row gap-2">

                            <DumbbellIcon className="w-5 h-5" />
                            <h3 className="font-semibold">{exercise.title}</h3>
                        </div>
                        <Button variant='outline' onClick={() => handleDelete(exercise)} className="border-0 h-6 ring-0 shadow-none "><MoreHorizontal /></Button>

                        <ExerciseOptin plan={plan} exercise={exercise} />
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
