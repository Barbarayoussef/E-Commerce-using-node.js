import joi from "joi";

export const checkoutSchema = joi.object({
  paymentMethod: joi.string().valid("card", "cod").required(),
  shippingAddress: joi.string().min(10),
});

export const updateOrderStatusSchema = joi.object({
  orderStatus: joi
    .string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});
