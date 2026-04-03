import joi from "joi";

export const updateSchema = joi.object({
  name: joi.string().min(3).max(30).optional(),
  phone: joi.string().min(11).max(15).optional(),
  avatar: joi.string().optional(),
});
