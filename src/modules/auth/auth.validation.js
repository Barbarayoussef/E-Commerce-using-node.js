import joi from "joi";

export const signupSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp(`^(?=.*[A-Z])(?=.*\d).{8,}$`))
    .required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
  phone: joi.string().min(11).max(15).required(),
  address: joi.string().min(10).optional(),
  role: joi.string().valid("user", "admin").optional().default("user"),
});
export const loginSchema = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
});
export const resendVerificationSchema = joi.object({
  email: joi.string().required().email(),
});
export const forgetPasswordSchema = joi.object({
  email: joi.string().required().email(),
});
export const resetPasswordSchema = joi.object({
  email: joi.string().required().email(),
  otp: joi.string().required(),
  newPassword: joi
    .string()
    .pattern(new RegExp(`^(?=.*[A-Z])(?=.*\d).{8,}$`))
    .required(),
});
