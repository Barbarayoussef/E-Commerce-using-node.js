import mongoose from "mongoose";

const databaseConnection = () => {
  mongoose
    .connect("mongodb://localhost:27017/e-commerce")
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
