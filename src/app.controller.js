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
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { messageModel } from "./database/model/message.model.js";
import staffRouter from "./modules/hrManagementSystem/staffMange/staff.controller.js";
import attendanceRouter from "./modules/hrManagementSystem/attendance/attendance.controller.js";
import deductionRouter from "./modules/hrManagementSystem/deduction/deduction.controller.js";
import salaryRouter from "./modules/hrManagementSystem/salary/salary.controller.js";

export const bootstrap = () => {
  const app = express();
  app.use(express.json());
  databaseConnection();
  const server = createServer(app);
  const io = new Server(server, { cors: { origin: "http://127.0.0.1:5500" } });

  io.use((socket, next) => {
    const authHeader =
      socket.handshake.headers.authorization || socket.handshake.auth.token;

    if (!authHeader) {
      return next(new Error("Unauthorized: No token provided"));
    }

    try {
      let [bearer, token] = authHeader.split(" ");
      let signature = "";

      switch (bearer) {
        case "admin":
          signature = env.adminSignature;
          break;
        case "user":
          signature = env.userSignature;
          break;
        default:
          return next(new Error("Unauthorized: Invalid bearer type"));
      }

      let decoded = jwt.verify(token, signature);

      socket.user = decoded;

      next();
    } catch (error) {
      return next(new Error("Unauthorized: Invalid token"));
    }
  });
  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.user.id} with role: ${socket.user.role}`);

    socket.on("admin:send-offer", async (payload) => {
      if (socket.user.role !== "admin") {
        return socket.emit("error", "Access Denied: You are not an admin!");
      }

      const offer = {
        ...payload,
        createdAt: new Date(),
      };
      console.log(offer);

      await messageModel.create(offer);
      io.emit("user:receive-offer", offer);
    });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subcategoryRouter);
  app.use("/api/v1", productRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1", orderRouter);
  app.use("/api/v1/admin", staffRouter);
  app.use("/api/v1/staff", attendanceRouter);
  app.use("/api/v1/admin/staff", deductionRouter);
  app.use("/api/v1/admin/staff", salaryRouter);

  server.listen(env.port, () => {
    console.log("server working");
  });
};
