import mongoose from "mongoose";

let deductionSchema = mongoose.Schema({
  staff: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

export const deductionModel = mongoose.model("deduction", deductionSchema);
