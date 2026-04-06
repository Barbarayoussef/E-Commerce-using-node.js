import { deductionModel } from "../../../database/model/deduction.model.js";
import { staffModel } from "../../../database/model/staff.model.js";

export const addDeduction = async (req, res) => {
  let { id } = req.params;
  let { amount, reason } = req.body;
  let staff = await staffModel.findById(id);
  if (!staff || staff.isActive == false)
    return res.status(404).json({ message: "staff not found" });
  let month = new Date().toISOString().slice(0, 7);
  let deduction = await deductionModel.create({
    staff: id,
    amount,
    reason,
    month,
  });
  staff.monthlyReports[0].totalDeductions += deduction.amount;
  staff.monthlyReports[0].isCalculated = false;
  await staff.save();
  res.json({ message: "deduction added successfully", deduction });
};

export const getStaffDeductions = async (req, res) => {
  let { id } = req.params;
  let staff = await staffModel.findById(id);
  if (!staff) return res.status(404).json({ message: "Staff not found" });
  let deductions = await deductionModel.find({ staff: id });
  if (deductions.length === 0) {
    return res
      .status(404)
      .json({ message: "No deductions found for this member" });
  }
  res.json({ message: "deductions found", deductions });
};

export const updateDeduction = async (req, res) => {
  let { id, deductionId } = req.params;
  let { amount, reason } = req.body;
  let staffMember = await staffModel.findById(id);
  if (!staffMember) return res.status(404).json({ message: "staff not found" });
  let deduction = await deductionModel.findById(deductionId);
  if (!deduction)
    return res.status(404).json({ message: "deduction not found" });
  let report = staffMember.monthlyReports.find(
    (r) => r.month === deduction.month,
  );
  if (!report)
    return res.status(404).json({ message: "No data found for this month" });
  if (report.isPaid)
    return res
      .status(400)
      .json({ message: "Cannot update: Salary already paid" });

  let oldDeduction = deduction.amount;
  report.totalDeductions -= oldDeduction;

  deduction.amount = amount ? amount : deduction.amount;
  deduction.reason = reason ? reason : deduction.reason;
  await deduction.save();
  report.totalDeductions += deduction.amount;
  report.isCalculated = false;
  await staffMember.save();
  res.json({ message: "deduction updated successfully" });
};

export const removeDeduction = async (req, res) => {
  let { id, deductionId } = req.params;
  const deduction = await deductionModel.findById(deductionId);
  if (!deduction)
    return res.status(404).json({ message: "Deduction not found" });
  let staffMember = await staffModel.findById(id);
  if (!staffMember) return res.status(404).json({ message: "staff not found" });
  let report = staffMember.monthlyReports.find(
    (r) => r.month === deduction.month,
  );
  if (!report)
    return res.status(404).json({ message: "No data found for this month" });
  if (report.isPaid)
    return res
      .status(400)
      .json({ message: "Cannot delete: Salary already paid" });
  let oldDeduction = deduction.amount;
  report.totalDeductions -= oldDeduction;
  report.isCalculated = false;
  await deductionModel.findByIdAndDelete(deductionId);
  await staffMember.save();
  res.json({ message: "deduction deleted successfully" });
};
