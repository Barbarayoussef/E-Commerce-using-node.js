import { productModel } from "../../database/model/product.model.js";
import { cartModel } from "../../database/model/cart.model.js";

export const addItemToCart = async (req, res) => {
  let { productId } = req.body;
  let product = await productModel.findById(productId);
  if (!product || product.isDeleted || product.stock === 0) {
    return res.status(404).json({ message: "product not found" });
  }
  let cart = await cartModel.findOne({ user: req.user.id });

  let existingProduct = cart.products.findIndex(
    (product) => product.productId.toString() === productId,
  );
  if (existingProduct !== -1) {
    cart.products[existingProduct].quantity += 1;
    if (cart.products[existingProduct].quantity > product.stock)
      return res
        .status(400)
        .json({ message: "Product quantity exceeds stock" });
    cart.products[existingProduct].totalPrice =
      cart.products[existingProduct].quantity * product.price;
  } else {
    cart.products.push({
      productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      totalPrice: product.price,
    });
  }

  let totalCartPrice = 0;
  cart.products.map((product) => (totalCartPrice += product.totalPrice));
  cart.totalCartPrice = totalCartPrice;
  await cart.save();
  return res
    .status(200)
    .json({ message: "Product added to cart successfully" });
};

export const viewCart = async (req, res) => {
  let { id } = req.user;
  let cart = await cartModel.findOne({ user: id });
  if (cart.products.length === 0) {
    return res.status(404).json({ message: "Cart is empty" });
  }
  return res.status(200).json({ message: "Your cart", cart });
};

export const updateQuantity = async (req, res) => {
  let { productId } = req.params;
  let { quantity } = req.body;
  let cart = await cartModel.findOne({ user: req.user.id });
  let existedProduct = await productModel.findById(productId);

  let product = cart.products.find(
    (product) => product.productId.toString() === productId,
  );
  if (!product) {
    return res.status(404).json({ message: "Product not found in cart" });
  }
  let returnedPrice = product.totalPrice;
  console.log(existedProduct.stock);

  let stock = existedProduct.stock + product.quantity;
  console.log(stock);

  console.log(existedProduct);

  if (quantity > stock)
    return res.status(400).json({
      message: `Product quantity exceeds stock, only ${stock} available`,
    });
  console.log(stock - quantity);

  //   existedProduct.stock = stock - quantity;
  //   await existedProduct.save();
  product.quantity = quantity;
  product.totalPrice = quantity * product.price;
  cart.totalCartPrice =
    cart.totalCartPrice - returnedPrice + product.totalPrice;
  await cart.save();
  return res
    .status(200)
    .json({ message: "Product quantity updated successfully" });
};

export const removeItem = async (req, res) => {
  let { productId } = req.params;
  let cart = await cartModel.findOne({ user: req.user.id });
  let product = await productModel.findById(productId);
  let productIndex = cart.products.findIndex(
    (product) => product.productId.toString() === productId,
  );
  if (productIndex === -1)
    return res.status(404).json({ message: "Product not found in cart" });
  //   if (product) {
  //     product.stock += cart.products[productIndex].quantity;
  //     await product.save();
  //   }
  let returnedPrice = cart.products[productIndex].totalPrice;
  cart.totalCartPrice -= returnedPrice;

  cart.products.splice(productIndex, 1);
  await cart.save();
  return res
    .status(200)
    .json({ message: "Product removed from cart successfully" });
};

export const clearCart = async (req, res) => {
  let cart = await cartModel.findOne({ user: req.user.id });
  if (cart.products.length === 0)
    return res.status(400).json({ message: "Cart is empty" });
  //   for (const item of cart.products) {
  //     let product = await productModel.findById(item.productId);
  //     if (product) {
  //       product.stock += item.quantity;
  //       await product.save();
  //     }
  //   }
  cart.products = [];
  cart.totalCartPrice = 0;
  await cart.save();
  return res.status(200).json({ message: "Cart cleared successfully" });
};
