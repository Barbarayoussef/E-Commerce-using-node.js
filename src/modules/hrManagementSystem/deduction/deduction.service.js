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
  let { deductionId } = req.params;
  let { amount, reason } = req.body;
  let deduction = await deductionModel.findById(deductionId);
  if (!deduction)
    return res.status(404).json({ message: "deduction not found" });
  deduction.amount = amount ? amount : deduction.amount;
  deduction.reason = reason ? reason : deduction.reason;
  await deduction.save();
  res.json({ message: "deduction updated successfully" });
};

export const removeDeduction = async (req, res) => {
  let { deductionId } = req.params;
  let deduction = await deductionModel.findByIdAndDelete(deductionId);
  if (!deduction)
    return res.status(404).json({ message: "deduction not found" });
  res.json({ message: "deduction deleted successfully" });
};
