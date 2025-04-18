import mongoose from "mongoose";

const { Schema } = mongoose;
const exercisePlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    exercises: [
      {
        exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise" },
        title: { type: String, required: true }, //운동명칭
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
