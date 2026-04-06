import { orderModel } from "../../database/model/order.model.js";
import { cartModel } from "../../database/model/cart.model.js";
import { productModel } from "../../database/model/product.model.js";
export const checkoutCart = async (req, res) => {
  let { id } = req.user;
  let { shippingAddress } = req.body;
  if (!shippingAddress) {
    return res.status(400).json({ message: "Shipping address is required" });
  }
  let cart = await cartModel.findOne({ user: id });
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  for (const item of cart.products) {
    let product = await productModel.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${item.name}`,
      });
    }
    for (const item of cart.products) {
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
    shippingAddress,
  });

  cart.products = [];
  cart.totalCartPrice = 0;
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
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }
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
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.orderStatus = orderStatus;
  await order.save();
  return res.status(200).json({ message: "Order status updated successfully" });
};
