import { userModel } from "../../database/model/user.model.js";

export const signup = async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  const avatar = req.file ? req.file.path : null;
  const existedUser = await userModel.findOne({ email });
  if (existedUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = await userModel.create({
    name,
    email,
    password,
    phone,
    address,
    role,
    avatar,
  });
  let otp = Math.floor(100000 + Math.random() * 900000).toString();

  res.status(201).json({ message: "Verification code sent to your email" });
};
