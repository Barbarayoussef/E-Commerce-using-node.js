import joi from "joi";

export const checkoutSchema = joi.object({
  shippingAddress: joi.string().min(10).required(),
});

export const updateOrderStatusSchema = joi.object({
  orderStatus: joi
    .string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});
