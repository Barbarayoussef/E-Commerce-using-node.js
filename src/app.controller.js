import express from "express";
import authRouter from "./modules/auth/auth.controller.js";

export const bootstrap = () => {
  const app = express();

  app.use("/api/v1/auth", authRouter);

  app.listen(3000, () => {
    console.log("server working");
  });
};
