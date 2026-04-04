import mongoose from "mongoose";

let messageSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ["offer", "announcement"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  discountCode: {
    type: String,
    optional: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export const messageModel = mongoose.model("message", messageSchema);
