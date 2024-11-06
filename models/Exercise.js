import mongoose from "mongoose";

const { Schema } = mongoose;
const exerciseSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.models.Exercise ||
  mongoose.model("Exercise", exerciseSchema);
