import joi from "joi";

export const addCategorySchema = joi.object({
  name: joi.string().min(2).max(50).required(),
});

export const updateCategorySchema = joi.object({
  name: joi.string().min(2).max(50).optional(),
});
