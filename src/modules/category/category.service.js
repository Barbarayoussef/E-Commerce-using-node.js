import categoryModel from "../../database/model/category.model.js";
import env from "../../../config/env.service.js";
import subcategoryModel from "../../database/model/subcategory.model.js";

export const addCategory = async (req, res) => {
  let { name } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image" });
  }
  let image = `${env.baseURL}/uploads/${req.file.filename}`;
  let category = await categoryModel.create({ name, image });
  return res
    .status(200)
    .json({ message: "Category added successfully", category });
};
export const updateCategory = async (req, res) => {
  let category = await categoryModel.findById(req.params.id);
  if (!category) {
    return res.status(400).json({ message: "Category not found" });
  }
  let { name } = req.body;
  if (req.file) {
    category.image = `${env.baseURL}/uploads/${req.file.filename}`;
  }
  name ? (category.name = name) : null;
  await category.save();
  return res.status(200).json({ message: "Category updated successfully" });
};

export const softDelete = async (req, res) => {
  let { id } = req.params;
  let now = Date.now();
  const category = await categoryModel.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: now },
    { new: true },
  );
  if (!category) {
    return res.status(400).json({ message: "Category not found" });
  }
  await subcategoryModel.updateMany(
    { category: category._id },
    { isDeleted: true, deletedAt: now },
  );
  return res.status(200).json({ message: "Category deleted successfully" });
};

export const getCategories = async (req, res) => {
  let categories = await categoryModel.find().populate({
    path: "subcategory",
    match: { isDeleted: false },
  });
  if (categories.length === 0) {
    return res.status(404).json({ message: "No categories found" });
  } else {
    return res.status(200).json({ message: "Categories found", categories });
  }
};
