import mongoose from "mongoose";

const { Schema } = mongoose;
const exerciseSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    exercisePlanId: { type: Schema.Types.ObjectId, ref: "ExercisePlan" },
    exercises: [
      {
        exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise" },
        title: { type: String, required: true }, // 운동명
        repTime: { type: Number, required: false }, // 운동 시간
        sets: { type: Number, required: true }, // 총 세트 수
        rest: { type: Number, required: true }, // 휴식시간
        state: { type: String, default: "pending" }, // pending, inProgress, done
        session: [
          {
            set: { type: Number, required: true }, //현재 세트
            reps: { type: Number, required: true }, // 반복횟수 (수정가능)필드
            weight: { type: Number, required: true }, // 중량
          },
        ],
      },
    ],
    state: { type: String, default: "inProgress" }, // inProgress, done
  },
  { timestamps: true }
);
export default mongoose.models.ExerciseSession ||
  mongoose.model("ExerciseSession", exerciseSessionSchema);
