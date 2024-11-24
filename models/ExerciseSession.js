import mongoose from "mongoose";

const { Schema } = mongoose;
const exerciseSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    exercisePlanId: { type: Schema.Types.ObjectId, ref: "ExercisePlan" },
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: [
      {
        exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise" },
        repTime: { type: Number, required: true }, // 운동 시간
        weight: { type: Number, required: true }, // 중량
        reps: { type: Number, required: true }, // 반복횟수 (수정가능) default는 초기에 plan에서 설정한 값
      },
    ],
    state: { type: String, default: "pending" }, // pending, inProgress, done
  },
  { timestamps: true }
);
export default mongoose.models.ExerciseSession ||
  mongoose.model("ExerciseSession", exerciseSessionSchema);
