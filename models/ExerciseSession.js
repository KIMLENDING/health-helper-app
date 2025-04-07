import mongoose from "mongoose";
import Exercise from "./Exercise"; // 이걸 추가 안하면 api에서 populate가 안됨 -  Mongoose의 populate 과정에서 실제 모델 스키마가 메모리에 로드되어 있어야 합니다.
// 명시적으로 추가해야
const { Schema } = mongoose;

// 하위 스키마 정의 (timestamps 옵션 사용 가능!)
const sessionSchema = new Schema(
  {
    set: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    endTime: { type: Date, required: false },
  },
  { timestamps: true }
);

const exerciseSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    exercisePlanId: { type: Schema.Types.ObjectId, ref: "ExercisePlan" },
    exercises: [
      {
        exerciseId: { type: Schema.Types.ObjectId, ref: Exercise },
        title: { type: String, required: true }, // 운동명
        repTime: { type: Number, required: false }, // 운동 시간
        sets: { type: Number, required: true }, // 총 세트 수
        rest: { type: Number, required: true }, // 휴식시간
        state: { type: String, default: "pending" }, // pending, inProgress, done
        session: [sessionSchema],
      },
    ],
    state: { type: String, default: "inProgress" }, // inProgress, done
  },
  { timestamps: true }
);
export default mongoose.models.ExerciseSession ||
  mongoose.model("ExerciseSession", exerciseSessionSchema);
