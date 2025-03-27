import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    provider: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// ✅ email + provider 복합 unique 인덱스 추가
userSchema.index({ email: 1, provider: 1 }, { unique: true });
export default mongoose.models.User || mongoose.model("User", userSchema);
