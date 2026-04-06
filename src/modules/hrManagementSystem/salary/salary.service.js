import { deductionModel } from "../../../database/model/deduction.model.js";
import { staffModel } from "../../../database/model/staff.model.js";

export const calculateSalary = async (req, res) => {
  let { id, month } = req.params;
  let staff = await staffModel.findById(id);
  if (!staff) return res.status(404).json({ message: "Staff not found" });

  let report = staff.monthlyReports.find((r) => r.month === month);

  if (!report)
    return res.status(404).json({ message: "No data found for this month" });
  if (report.isCalculated)
    return res.status(400).json({ message: "Salary already calculated" });
  if (report.isPaid) {
    return res.status(400).json({ message: "Salary already paid" });
  }

  let baseSalary = report.totalDaysWorked * staff.dailySalary;

  let deductions = await deductionModel.find({ staff: id, month: month });
  let totalDeduction = deductions.reduce((sum, d) => sum + d.amount, 0);

  let adjustments = staff.adjustment.filter((adj) => adj.month === month);
  let totalAdjustment = adjustments.reduce((sum, a) => sum + a.amount, 0);

  report.totalDeductions = totalDeduction;
  report.finalSalary = baseSalary - totalDeduction + totalAdjustment;
  report.isCalculated = true;

  await staff.save();

  res.json({ message: "Salary calculated", finalSalary: report.finalSalary });
};
export const markSalaryAsPaid = async (req, res) => {
  let { id, month } = req.params;
  let staff = await staffModel.findById(id);
  if (!staff) return res.status(404).json({ message: "staff not found" });
  let report = staff.monthlyReports.find((report) => report.month === month);
  if (!report) return res.status(404).json({ message: "report not found" });
  if (report.isPaid)
    return res.status(400).json({ message: "salary already paid" });
  if (report.isCalculated == false)
    return res.status(400).json({ message: "salary not calculated" });
  report.isPaid = true;
  report.paidAt = Date.now();
  await staff.save();
  res.json({ message: "salary marked as paid successfully" });
};

export const adjustSalary = async (req, res) => {
  let { id, month } = req.params;
  let staff = await staffModel.findById(id);
  if (!staff) return res.status(404).json({ message: "staff not found" });
  let report = staff.monthlyReports.find((r) => r.month === month);
  if (!report) return res.status(404).json({ message: "report not found" });
  if (report.isPaid) {
    return res
      .status(400)
      .json({ message: "Cannot adjust salary that is already paid" });
  }
  let { amount, reason } = req.body;
  staff.adjustment.push({ amount, reason, createdAt: Date.now(), month });
  report.isCalculated = false;
  await staff.save();
  res.json({ message: "salary adjusted successfully" });
};
