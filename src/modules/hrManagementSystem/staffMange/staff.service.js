import { staffModel } from "../../../database/model/staff.model.js";
import { userModel } from "../../../database/model/user.model.js";

export const addStaffMember = async (req, res) => {
  let { userId, dailySalary, department } = req.body;
  let foundedUser = await userModel.findById(userId);
  if (!foundedUser) {
    return res.status(404).json({ message: "user  not found" });
  }
  let foundedStaff = await staffModel.findOne({ user: userId });
  if (foundedStaff) {
    return res.status(400).json({ message: "user is already a staff member" });
  }
  await staffModel.create({
    user: userId,
    dailySalary,
    joinDate: new Date(),
    department,
  });
  foundedUser.role = "staff";
  await foundedUser.save();
  res.json({ message: "staff member added successfully" });
};

export const getAllStaff = async (req, res) => {
  let staff = await staffModel.find().populate("user");
  if (staff.length === 0) {
    return res.status(404).json({ message: "No staff members found" });
  }
  res.json(staff);
};

export const getStaffDetails = async (req, res) => {
  let { id } = req.params;
  let staff = await staffModel.findById(id).populate("user");
  if (!staff) {
    return res.status(404).json({ message: "staff not found" });
  }
  res.json(staff);
};
export const updateStaffInfo = async (req, res) => {
  let { id } = req.params;
  let staff = await staffModel.findById(id);
  if (!staff) {
    return res.status(404).json({ message: "staff not found" });
  }
  let { dailySalary, department } = req.body;
  staff.dailySalary = dailySalary ? dailySalary : staff.dailySalary;
  staff.department = department ? department : staff.department;
  await staff.save();
  res.json({ message: "staff updated successfully" });
};
export const softDeleteStaff = async (req, res) => {
  let { id } = req.params;
  let staff = await staffModel.findById(id);
  let user = await userModel.findById(staff.user);
  if (!staff) {
    return res.status(404).json({ message: "staff not found" });
  }
  staff.isActive = false;
  staff.deletedAt = Date.now();
  staff.isDeleted = true;
  await staff.save();
  user.role = "user";
  await user.save();
  res.json({ message: "staff deleted successfully" });
};
