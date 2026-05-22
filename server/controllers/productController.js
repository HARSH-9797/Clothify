import productModel from "../models/productModel.js";
import { cloudinary, uploadToCloudinary } from "../middleware/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    const imageUrl = result.secure_url;

    const product = new productModel({
      name,
      description,
      price: Number(price),
      image: [imageUrl],
      category,
      subCategory: subCategory || "",
      sizes: sizes ? JSON.parse(sizes) : [],
      bestseller: bestseller === "true",
      date: Date.now()
    });

    await product.save();
    res.json({ success: true, message: "Product Added", product });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};