import subcategoryModel from "../../database/model/subcategory.model.js";
import categoryModel from "../../database/model/category.model.js";

export const createSubcategory = async (req, res) => {
  let { name, categoryName } = req.body;
  let category = await categoryModel.findOne({ name: categoryName });
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  let subcategory = await subcategoryModel.create({
    name,
    categoryId: category._id,
    categoryName,
  });
  category.subcategory.push(subcategory._id);
  await category.save();

  return res
    .status(201)
    .json({ message: "Subcategory created successfully", subcategory });
};

export const updateSubcategory = async (req, res) => {
  let { name, categoryName } = req.body;
  let { id } = req.params;
  let subcategory = await subcategoryModel.findById(id);
  if (!subcategory) {
    return res.status(404).json({ message: "Subcategory not found" });
  }
  let category = "";
  if (categoryName) {
    category = await categoryModel.findOne({ name: categoryName });
  }
  let updatedSubcategory = await subcategoryModel.findByIdAndUpdate(id, {
    name: name ? name : subcategory.name,
    categoryId: category ? category._id : subcategory.categoryId,
    categoryName: category ? category.name : subcategory.categoryName,
  });
  return res.status(200).json({ message: "Subcategory updated successfully" });
};
export const softDelete = async (req, res) => {
  let { id } = req.params;
  let subcategory = await subcategoryModel.findById(id);
  subcategory.isDeleted = true;
  subcategory.deletedAt = Date.now();
  await subcategory.save();
  return res.status(200).json({ message: "Subcategory deleted successfully" });
};
