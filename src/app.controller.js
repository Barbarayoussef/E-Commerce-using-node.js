import express from "express";
import authRouter from "./modules/auth/auth.controller.js";
import env from "../config/env.service.js";
import { databaseConnection } from "./database/connection.js";
import userRouter from "./modules/user/user.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import subcategoryRouter from "./modules/subcategory/subcategory.controller.js";
import productRouter from "./modules/product/product.controller.js";
import cartRouter from "./modules/cart/cart.controller.js";
import orderRouter from "./modules/order/order.controller.js";

export const bootstrap = () => {
  const app = express();
  app.use(express.json());
  databaseConnection();

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subcategoryRouter);
  app.use("/api/v1", productRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1", orderRouter);

  app.listen(env.port, () => {
    console.log("server working");
  });
};
