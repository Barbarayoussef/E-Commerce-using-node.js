import { orderModel } from "../../database/model/order.model.js";
import { cartModel } from "../../database/model/cart.model.js";
import { productModel } from "../../database/model/product.model.js";
import Stripe from "stripe";
import env from "../../../config/env.service.js";

const stripeInstance = new Stripe(env.stripeSecretKey);
export const checkoutCart = async (req, res) => {
  let { id } = req.user;
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
  }
  let { paymentMethod } = req.body;
  if (!paymentMethod) {
    return res.status(400).json({ message: "Payment method is required" });
  }
  if (paymentMethod === "cod") {
    let { shippingAddress } = req.body;
    if (!shippingAddress) {
      return res
        .status(400)
        .json({ message: "Shipping address is required for cash on delivery" });
    }
    for (const item of cart.products) {
      let product = await productModel.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }
    let order = await orderModel.create({
      user: id,
      orderStatus: "pending",
      paymentStatus: "pending",
      orderDate: new Date(),
      products: cart.products,
      totalOrderPrice: cart.totalCartPrice,
      shippingAddress,
      paymentMethod,
    });

    cart.products = [];
    cart.totalCartPrice = 0;
    await cart.save();
    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  }

  const session = await stripeInstance.checkout.sessions.create({
    line_items: cart.products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    client_reference_id: req.user.id,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "EG"],
    },
    success_url: `https://example.com/success`,
    cancel_url: `https://example.com/cancel`,
  });

  return res.status(200).json({ url: session.url });
};
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body, // raw body buffer
      sig, // stripe's signature from headers
      env.stripeWebhookSecret, // your secret to verify against
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    // event.data.object contains the full Stripe session object
    const session = event.data.object;

    if (session.payment_status === "paid") {
      const existingOrder = await orderModel.findOne({
        stripeSessionId: session.id,
      });
      if (existingOrder) {
        return res.status(200).json({ received: true });
      }

      // Get the user ID we stored when creating the Stripe session
      const userId = session.client_reference_id;

      // Get the user's cart from DB
      const cart = await cartModel.findOne({ user: userId });

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "Cart not found or empty" });
      }

      // Deduct stock for each product
      for (const item of cart.products) {
        const product = await productModel.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
      }

      // Create the order in your DB
      await orderModel.create({
        user: userId,
        orderStatus: "pending",
        paymentStatus: "paid",
        orderDate: new Date(),
        products: cart.products,
        totalOrderPrice: cart.totalCartPrice,
        paymentMethod: "card",
        stripeSessionId: session.id,
        shippingAddress: session.customer_details?.address
          ? JSON.stringify(session.customer_details.address)
          : "No address provided",
      });

      // Clear the cart
      cart.products = [];
      cart.totalCartPrice = 0;
      await cart.save();
    }
  }
  return res.status(200).json({ received: true });
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
