import mongoose from "mongoose";

let categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    subcategory: [{ type: mongoose.Types.ObjectId, ref: "subcategory" }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

let categoryModel = mongoose.model("category", categorySchema);
export default categoryModel;
