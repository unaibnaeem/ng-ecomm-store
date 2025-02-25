const Product = require("../db/product");

async function addProduct(model) {
  let product = new Product({
    ...model,
  });
  await product.save();
  return product.toObject();
}

async function getProducts() {
  let products = await Product.find();

  return products.map((product) => product.toObject());
}

async function getProductById(id) {
  let product = await Product.findById(id).lean();

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

async function getRegularProducts() {
  let regularProducts = await Product.find({
    isFeaturedProduct: { $ne: true },
    isNewProduct: { $ne: true },
  });

  return regularProducts.map((product) => product.toObject());
}

async function getNewProducts() {
  let newProducts = await Product.find({
    isNewProduct: true,
  });
  return newProducts.map((newProduct) => newProduct.toObject());
}

async function getFeaturedProducts() {
  let featuredProducts = await Product.find({
    isFeaturedProduct: true,
  });
  return featuredProducts.map((featuredProduct) => featuredProduct.toObject());
}

async function getProductsForListing(
  searchTerm,
  categoryId,
  brandId,
  sortBy,
  sortOrder,
  page,
  pageSize
) {
  let queryFilter = {};

  if (!sortBy) {
    sortBy = "price";
  }
  if (!sortOrder) {
    sortOrder = -1;
  }
  if (searchTerm) {
    queryFilter.$or = [
      { name: { $regex: ".*" + searchTerm + ".*", $options: "i" } },
      { shortDescription: { $regex: ".*" + searchTerm + ".*", $options: "i" } },
      { description: { $regex: ".*" + searchTerm + ".*", $options: "i" } },
    ];
  }
  if (categoryId) {
    queryFilter.categoryId = categoryId;
  }
  if (brandId) {
    queryFilter.brandId = brandId;
  }

  const products = await Product.find(queryFilter)
    .sort({
      [sortBy]: +sortOrder,
    })
    .skip((+page - 1) * +pageSize)
    .limit(+pageSize);

  return products.map((product) => product.toObject());
}

async function updateProduct(id, model) {
  await Product.findByIdAndUpdate(id, model);
  return;
}

async function deleteProduct(id) {
  await Product.findByIdAndDelete(id);
  return;
}

async function getProductReviews(productId) {
  let product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");
  return product.reviews;
}

async function addProductReview(productId, reviewData) {
  let product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.reviews.unshift(reviewData);
  await product.save();
  return product.reviews;
}

async function deleteProductReview(productId, reviewId) {
  let product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const reviewIndex = product.reviews.findIndex(
    (rev) => rev._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    throw new Error("Review not found");
  }

  product.reviews.splice(reviewIndex, 1);

  await product.save();

  return product.reviews;
}

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  getRegularProducts,
  getNewProducts,
  getFeaturedProducts,
  getProductsForListing,
  updateProduct,
  deleteProduct,
  getProductReviews,
  addProductReview,
  deleteProductReview,
};
