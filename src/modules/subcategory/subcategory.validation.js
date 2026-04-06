import joi from "joi";

export const createSubcategorySchema = joi.object({
  name: joi.string().min(2).max(50).required(),
});

export const updateSubcategorySchema = joi.object({
  name: joi.string().min(2).max(50).optional(),
});
