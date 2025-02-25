const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  shortDescription: String,
  price: Number,
  discount: { type: Number, default: 0 },
  images: Array(String),
  categoryId: { type: Schema.Types.ObjectId, ref: "categories" },
  brandId: { type: Schema.Types.ObjectId, ref: "brands" },
  isFeaturedProduct: Boolean,
  isNewProduct: Boolean,
  reviews: [reviewSchema],
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
