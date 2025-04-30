import mongoose from "mongoose";
import Exercise from "./Exercise";

/**
 * populate를 쓸 때는 모델을 명시적으로 import 해줘야 함
 * - Mongoose의 populate 과정에서 실제 모델 스키마가 메모리에 로드되어 있어야 합니다.
 * 이게 없으면 가끔씩 서버 오류를 일으킴
 */
const { Schema } = mongoose;
const exercisePlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    exercises: [
      {
        exerciseId: { type: Schema.Types.ObjectId, ref: Exercise },
        // title: { type: String, required: true }, //운동명칭
        sets: { type: Number, required: true }, // 세트 수
        reps: { type: Number, required: true }, // 반복횟수
        weight: { type: Number, required: true }, // 무게
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.models.ExercisePlan ||
  mongoose.model("ExercisePlan", exercisePlanSchema);

/**
   
Mongoose에서 populate()를 사용할 때는 반드시 참조 대상 모델을 import 하여 스키마를 메모리에 등록해야 합니다. 
그렇지 않으면 Mongoose는 해당 모델을 찾을 수 없고, populate() 시 undefined 오류가 발생할 수 있습니다. 
이는 개발 중 hot reload나 비동기 모듈 로딩 과정에서 자주 발생하는 문제이므로, 명시적인 import는 필수입니다
   */
