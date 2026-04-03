import express from "express";
import authRouter from "./modules/auth/auth.controller.js";
import env from "../config/env.service.js";
import { databaseConnection } from "./database/connection.js";
import userRouter from "./modules/user/user.controller.js";

export const bootstrap = () => {
  const app = express();
  app.use(express.json());
  databaseConnection();

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);

  app.listen(env.port, () => {
    console.log("server working");
  });
};
