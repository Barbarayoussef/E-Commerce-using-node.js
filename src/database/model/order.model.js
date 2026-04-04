import mongoose from "mongoose";

let orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    products: [
      {
        productId: mongoose.Types.ObjectId,
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        totalPrice: Number,
      },
    ],
    totalOrderPrice: { type: Number, default: 0 },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true },
);

export const orderModel = mongoose.model("order", orderSchema);
