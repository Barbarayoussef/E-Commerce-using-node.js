import { userModel } from "../../database/model/user.model.js";
import bcrypt from "bcrypt";
import env from "../../../config/env.service.js";
import { sendEmail } from "../../common/email/sendEmail.js";
import jwt from "jsonwebtoken";
import { generateBothToken } from "../../middleware/auth.js";
import { client } from "../../database/redis.connection.js";

export const signup = async (req, res) => {
  const { name, email, password, confirmPassword, phone, address, role } =
    req.body;
  const avatar = req.file ? req.file.path : null;
  const existedUser = await userModel.findOne({ email });
  if (existedUser && !existedUser.isDeleted) {
    return res.status(400).json({ message: "User already exists" });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password do not match" });
  }
  let hashedPassword = await bcrypt.hash(password, Number(env.saltRound));

  let token = jwt.sign({ email }, env.emailVerifySecret, {
    expiresIn: "5m",
  });
  let link = `
  <a href="${env.baseURL}/api/v1/auth/verify-email/${token}" 
     style="
      background-color: #4F46E5; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      font-family: sans-serif; 
      display: inline-block;
     ">
    Verify Account
  </a>
`;
  await sendEmail(email, "Verify your email", "verify", link);
  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    role,
    avatar,
  });
  return res
    .status(201)
    .json({ message: "Verification link sent to your email" });
};
export const verifyAccount = async (req, res) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, env.emailVerifySecret);
  console.log(decoded);
  try {
    let user = await userModel.findOne({ email: decoded.email });
    if (!user || user.isDeleted) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Link expired. Please signup again." });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user || user.isDeleted) {
    return res.status(400).json({ message: "no user found" });
  }
  let passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  if (!user.isVerified) {
    return res.status(400).json({ message: "Please verify your email" });
  }
  let { accessToken, refreshToken } = generateBothToken(user);
  return res.status(200).json({
    message: "Login successful",
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

export const resendVerification = async (req, res) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user || user.isDeleted) {
    return res.status(400).json({ message: "no user found" });
  }
  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }
  let token = jwt.sign({ email }, env.emailVerifySecret, {
    expiresIn: "5m",
  });
  let link = `
  <a href="${env.baseURL}/api/v1/auth/verify-email/${token}" 
     style="
      background-color: #4F46E5; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      font-family: sans-serif; 
      display: inline-block;
     ">
    Verify Account
  </a>
`;
  await sendEmail(email, "Verify your email", "verify", link);
  return res
    .status(200)
    .json({ message: "Verification link sent to your email" });
};

export const forgetPassword = async (req, res) => {
  let { email } = req.body;
  let user = await userModel.findOne({ email });
  if (!user || user.isDeleted) {
    return res.status(400).json({ message: "no user found" });
  }
  if (!user.isVerified) {
    return res.status(400).json({ message: "Please verify your email" });
  }
  let otp = Math.floor(100000 + Math.random() * 10000);
  await client.set(`${user.email}:otp`, otp, {
    EX: 300, // Expire after 5 minutes
  });
  await sendEmail(email, "Reset your password", `Your OTP is ${otp}`, null);
  return res.status(200).json({ message: "OTP sent to your email" });
};

export const resetPassword = async (req, res) => {
  let { email, otp, newPassword } = req.body;
  let user = await userModel.findOne({ email });
  if (!user || user.isDeleted) {
    return res.status(400).json({ message: "no user found" });
  }
  let storedOtp = await client.get(`${user.email}:otp`);
  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  let hashedPassword = await bcrypt.hash(newPassword, env.saltRound);
  user.password = hashedPassword;
  await user.save();
  await client.del(`${user.email}:otp`);
  return res.status(200).json({ message: "Password reset successful" });
};
