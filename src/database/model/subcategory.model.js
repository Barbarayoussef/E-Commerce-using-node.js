import mongoose from "mongoose";

let subcategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Types.ObjectId, ref: "category" },
    categoryName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

let subcategoryModel = mongoose.model("subcategory", subcategorySchema);
export default subcategoryModel;
