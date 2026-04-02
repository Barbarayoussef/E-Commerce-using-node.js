import express from "express";

export const bootstrap = () => {
  const app = express();

  app.listen(3000, () => {
    console.log("server working");
  });
};
