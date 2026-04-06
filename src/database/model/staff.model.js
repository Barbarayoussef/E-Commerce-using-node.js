import mongoose from "mongoose";

let staffSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  dailySalary: {
    type: Number,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  monthlyReports: [
    {
      month: String,
      totalDaysWorked: { type: Number, default: 0 },
      totalDeductions: { type: Number, default: 0 },
      finalSalary: { type: Number, default: 0 },
      isPaid: { type: Boolean, default: false },
      paidAt: Date,
      isCalculated: { type: Boolean, default: false },
    },
  ],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  adjustment: [
    {
      reason: String,
      amount: Number,
      createdAt: Date,
      month: String,
    },
  ],
});

export const staffModel = mongoose.model("staff", staffSchema);
