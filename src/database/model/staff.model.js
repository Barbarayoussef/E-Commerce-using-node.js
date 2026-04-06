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
      totalDaysWorked: Number,
      totalDeductions: Number,
      finalSalary: Number,
      isPaid: Boolean,
      paidAt: Date,
    },
  ],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  totalWorkedHours: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
});

export const staffModel = mongoose.model("staff", staffSchema);
