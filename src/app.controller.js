import express from "express";
import authRouter from "./modules/auth/auth.controller.js";
import env from "../config/env.service.js";
import { databaseConnection } from "./database/connection.js";

export const bootstrap = () => {
  const app = express();
  app.use(express.json());
  databaseConnection();

  app.use("/api/v1/auth", authRouter);

  app.listen(env.port, () => {
    console.log("server working");
  });
};
