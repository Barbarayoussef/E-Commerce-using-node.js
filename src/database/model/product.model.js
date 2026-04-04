import mongoose from "mongoose";

let productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }],
    categoryId: { type: mongoose.Types.ObjectId, ref: "category" },
    categoryName: { type: String, required: true },
    subcategoryId: { type: mongoose.Types.ObjectId, ref: "subcategory" },
    subcategoryName: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    autoDeletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
productSchema.pre("save", function () {
  if (this.stock === 0) {
    this.isDeleted = true;
    this.autoDeletedAt = new Date();
  } else {
    this.isDeleted = false;
    this.autoDeletedAt = null;
  }
});

export const productModel = mongoose.model("product", productSchema);
