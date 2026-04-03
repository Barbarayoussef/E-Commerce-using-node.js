import mongoose from "mongoose";

let subcategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    category: { type: mongoose.Types.ObjectId, ref: "category" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

let subcategoryModel = mongoose.model("subcategory", subcategorySchema);
export default subcategoryModel;
