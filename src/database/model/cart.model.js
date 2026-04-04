import mongoose from "mongoose";

let cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
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
  totalCartPrice: { type: Number, default: 0 },
});

export const cartModel = mongoose.model("cart", cartSchema);
