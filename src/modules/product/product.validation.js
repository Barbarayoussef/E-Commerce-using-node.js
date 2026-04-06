import joi from "joi";

export const addProductSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  price: joi.number().positive().required(),
  description: joi.string().optional(),
  stock: joi.number().integer().min(1).required(),
});

export const updateProductSchema = joi.object({
  name: joi.string().min(2).max(100).optional(),
  price: joi.number().positive().optional(),
  description: joi.string().optional(),
  stock: joi.number().integer().min(0).optional(),
});

export const updateStockSchema = joi.object({
  stock: joi.number().integer().min(0).required(),
});
