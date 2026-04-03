import { userModel } from "../../database/model/user.model.js";
import env from "../../../config/env.service.js";

export const getProfile = async (req, res) => {
  console.log(req.user);
  let profile = await userModel
    .findById(req.user.id)
    .select("-password -__v -isDeleted -deletedAt  -isVerified");
  res.status(200).json({ message: "Your profile", profile });
};

export const updateProfile = async (req, res) => {
  console.log(req.body);

  let { name, phone, avatar } = req.body;
  let user = await userModel.findById(req.user.id);
  name ? (user.name = name) : null;
  phone ? (user.phone = phone) : null;
  if (req.file) {
    user.avatar = `${env.baseURL}/uploads/${req.file.fieldname}`;
  }
  await user.save();
  res.status(200).json({ message: "Profile updated successfully" });
};

export const softDelete = async (req, res) => {
  let user = await userModel.findById(req.user.id);
  user.isDeleted = true;
  user.deletedAt = Date.now();
  await user.save();
  res.status(200).json({ message: "Account deleted successfully" });
};

export const uploadAvatar = async (req, res) => {
  let user = await userModel.findById(req.user.id);
  user.avatar = `${env.baseURL}/uploads/${req.file.filename}`;
  await user.save();
  res.status(200).json({ message: "Avatar uploaded successfully" });
};
