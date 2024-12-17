export const tags = {
    상체: { // 대분류
        팔: ["이두", "삼두"], // 중분류 - [소분류]
        어깨: ["전면", "측면", "후면"],
        가슴: ["대흉근", "소흉근"],
        등: ["광배근", "승모근"],
        배: ["복직근", "복사근"]
    },
    하체: {
        엉덩이: ["대둔근", "중둔근", "소둔근"],
        허벅지: ["대퇴사두근", "대퇴이두근"],
        종아리: ["비복근", "가자미근"]
    }
};
export interface Tags {
    상체: {
        팔: string[];
        어깨: string[];
        가슴: string[];
        등: string[];
        배: string[];
    };
    하체: {
        엉덩이: string[];
        허벅지: string[];
        종아리: string[];
    };
}
export type Exercise = {
    _id: string
    title: string
    description: string
    url: string
    tags: string[]
}
export interface exercise {
    title: string;
    url: string;
    tags: string[];
}

export interface ExercisePlan {
    _id?: string,
    userId: string,
    title: string,
    exercises: ExerciseOption[]

}

export interface ExerciseOption {
    _id?: string,
    exerciseId: string,
    title: string,
    sets: number,
    reps: number,
    rest: number
}

export interface ExerciseSession {
    _id?: string,
    userId: string,
    exercisePlanId: string,
    exercises: ExerciseOptionSession[],
    state: string // 'inProgress' | 'done' 초기 상태는 inProgress 
    createdAt?: string

}
export interface ExerciseOptionSession {
    _id?: string,
    exerciseId: string,
    title: string,
    repTime?: number, // 마지막에 운동시간 저장
    sets: number,
    rest: number,
    state: string, //'pending' | 'inProgress' | 'done'
    session: ExercisesessionData[]

}
export interface ExercisesessionData {
    _id?: string
    set: number,
    reps: number,
    weight: number,
}


export interface PostExerciseSession {
    sessionId: string,
    exerciseId: string,
    sessionData: ExercisesessionData
}
