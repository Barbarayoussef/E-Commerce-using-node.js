import joi from "joi";

export const addDeductionSchema = joi.object({
  amount: joi.number().positive().required(),
  reason: joi.string().min(3).required(),
});

export const updateDeductionSchema = joi.object({
  amount: joi.number().positive().optional(),
  reason: joi.string().min(3).optional(),
});
