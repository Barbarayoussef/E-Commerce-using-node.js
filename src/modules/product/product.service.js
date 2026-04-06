import { productModel } from "../../database/model/product.model.js";
import categoryModel from "../../database/model/category.model.js";
import subcategoryModel from "../../database/model/subcategory.model.js";
import env from "../../../config/env.service.js";
export const addProduct = async (req, res) => {
  let { name, price, description, stock, categoryId, subcategoryId } = req.body;
  const category = await categoryModel.findById(categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });

  let subcategoryName = "";
  if (subcategoryId) {
    const subcategory = await subcategoryModel.findById(subcategoryId);
    if (subcategory) subcategoryName = subcategory.name;
  }
  const images = req.files ? req.files.map((file) => file.path) : [];

  const product = await productModel.create({
    name,
    price,
    description,
    stock,
    images,
    categoryId,
    categoryName: category.name,
    subcategoryId,
    subcategoryName,
  });
  return res
    .status(201)
    .json({ message: "Product added successfully", product });
};

export const updateProducts = async (req, res) => {
  let { name, price, description, stock, categoryId, subcategoryId } = req.body;
  const product = await productModel.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (name) product.name = name;
  if (price) product.price = price;
  if (description) product.description = description;
  if (stock) product.stock = stock;
  if (categoryId) product.categoryId = categoryId;
  if (subcategoryId) product.subcategoryId = subcategoryId;
  if (req.files) product.images = req.files.map((file) => file.path);

  await product.save();
  return res
    .status(200)
    .json({ message: "Product updated successfully", product });
};

export const softDelete = async (req, res) => {
  let { id } = req.params;
  let product = await productModel.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.isDeleted)
    return res.status(400).json({ message: "Product already deleted" });
  product.isDeleted = true;
  product.deletedAt = Date.now();
  await product.save();
  return res.status(200).json({ message: "Product deleted successfully" });
};
export const updateStock = async (req, res) => {
  let { id } = req.params;
  let { stock } = req.body;
  let product = await productModel.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (stock === 0) {
    return res
      .status(400)
      .json({ message: "Stock cannot be 0, use delete instead" });
  }
  product.stock = stock;
  await product.save();
  return res
    .status(200)
    .json({ message: "Product stock updated successfully" });
};

export const getAllProducts = async (req, res) => {
  let { page, limit, minPrice, maxPrice } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let skip = (page - 1) * limit;
  let filterByPrice = {};

  if (minPrice || maxPrice) {
    if (minPrice) {
      filterByPrice = { price: { $gte: Number(minPrice) } };
    }
    if (maxPrice) {
      filterByPrice = { price: { $lte: Number(maxPrice) } };
    }
    if (minPrice && maxPrice) {
      filterByPrice = {
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      };
    }
  }
  let { sort } = req.query;
  if (sort === "price_asc") sort = "price";
  else if (sort === "price_desc") sort = "-price";
  else if (sort === "name") sort = "name";
  else if (sort === "createdAt") sort = "createdAt";
  else sort = "-createdAt";
  console.log(filterByPrice);

  let products = await productModel
    .find(filterByPrice)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  if (products.length === 0) {
    return res.status(404).json({ message: "Products not found" });
  }

  const totalRecords = await productModel.countDocuments(filterByPrice);

  res.status(200).json({
    message: "Success",
    metadata: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    },
    data: products,
  });
};
export const getProductById = async (req, res) => {
  let { id } = req.params;
  let product = await productModel.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.status(200).json({ message: "Product found", product });
};

export const getProductOfCategory = async (req, res) => {
  let { categoryId } = req.params;
  let category = await categoryModel.findById(categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });
  let { page, limit, minPrice, maxPrice } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let skip = (page - 1) * limit;
  let filterByPrice = {};

  if (minPrice || maxPrice) {
    if (minPrice) {
      filterByPrice = { price: { $gte: Number(minPrice) } };
    }
    if (maxPrice) {
      filterByPrice = { price: { $lte: Number(maxPrice) } };
    }
    if (minPrice && maxPrice) {
      filterByPrice = {
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      };
    }
  }
  let { sort } = req.query;
  if (sort === "price_asc") sort = "price";
  else if (sort === "price_desc") sort = "-price";
  else if (sort === "name") sort = "name";
  else if (sort === "createdAt") sort = "createdAt";
  else sort = "-createdAt";
  let products = await productModel
    .find({ categoryId, ...filterByPrice })
    .sort(sort)
    .skip(skip)
    .limit(limit);
  if (products.length === 0) {
    return res.status(404).json({ message: "Products not found" });
  }

  const totalRecords = await productModel.countDocuments({
    categoryId,
    ...filterByPrice,
  });

  res.status(200).json({
    message: "Success",
    metadata: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    },
    data: products,
  });
};
export const getProductsOfSubcategory = async (req, res) => {
  let { subcategoryId } = req.params;
  let subcategory = await subcategoryModel.findById(subcategoryId);
  if (!subcategory)
    return res.status(404).json({ message: "Subcategory not found" });
  let { page, limit, minPrice, maxPrice } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let skip = (page - 1) * limit;
  let filterByPrice = {};

  if (minPrice || maxPrice) {
    if (minPrice) {
      filterByPrice = { price: { $gte: Number(minPrice) } };
    }
    if (maxPrice) {
      filterByPrice = { price: { $lte: Number(maxPrice) } };
    }
    if (minPrice && maxPrice) {
      filterByPrice = {
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      };
    }
  }
  let { sort } = req.query;
  if (sort === "price_asc") sort = "price";
  else if (sort === "price_desc") sort = "-price";
  else if (sort === "name") sort = "name";
  else if (sort === "createdAt") sort = "createdAt";
  else sort = "-createdAt";
  let products = await productModel
    .find({ subcategoryId, ...filterByPrice })
    .sort(sort)
    .skip(skip)
    .limit(limit);
  if (products.length === 0) {
    return res.status(404).json({ message: "Products not found" });
  }

  const totalRecords = await productModel.countDocuments({
    subcategoryId,
    ...filterByPrice,
  });

  res.status(200).json({
    message: "Success",
    metadata: {
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    },
    data: products,
  });
};
