import express from "express";
import authRouter from "./modules/auth/auth.controller.js";
import env from "../config/env.service.js";

export const bootstrap = () => {
  const app = express();

  app.use("/api/v1/auth", authRouter);

  app.listen(env.port, () => {
    console.log("server working");
  });
};
