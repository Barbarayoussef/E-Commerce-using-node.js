import { orderModel } from "../../database/model/order.model.js";
import { cartModel } from "../../database/model/cart.model.js";
import { productModel } from "../../database/model/product.model.js";
export const checkoutCart = async (req, res) => {
  let { id } = req.user;
  let cart = await cartModel.findOne({ user: id });
  for (const item of cart.products) {
    let product = await productModel.findById(item.productId);
    if (product) {
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Product quantity exceeds stock, only ${product.stock} available`,
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }
  }
  let order = await orderModel.create({
    user: id,
    orderStatus: "pending",
    paymentStatus: "pending",
    orderDate: new Date(),
    products: cart.products,
    totalOrderPrice: cart.totalCartPrice,
  });

  cart.products = [];
  await cart.save();
  return res.status(200).json({ message: "Order placed successfully", order });
};

export const viewMyOrders = async (req, res) => {
  let { id } = req.user;
  let orders = await orderModel.find({ user: id });
  return res.status(200).json({ message: "Your orders", orders });
};

export const viewOrderDetails = async (req, res) => {
  let { id } = req.params;
  let order = await orderModel.findById(id);
  return res.status(200).json({ message: "Order details", order });
};

export const viewAllOrders = async (req, res) => {
  let orders = await orderModel.find();
  return res.status(200).json({ message: "All orders", orders });
};

export const updateOrderStatus = async (req, res) => {
  let { id } = req.params;
  let { orderStatus } = req.body;
  let order = await orderModel.findById(id);
  order.orderStatus = orderStatus;
  await order.save();
  return res.status(200).json({ message: "Order status updated successfully" });
};
