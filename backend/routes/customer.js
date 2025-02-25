const express = require("express");
const router = express.Router();

const { getCategories } = require("../handlers/category-handler");
const { getBrands } = require("../handlers/brand-handler");
const {
  getProductsForListing,
  getProductById,
  getNewProducts,
  getFeaturedProducts,
  getRegularProducts,
  addProductReview,
} = require("../handlers/product-handler");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../handlers/wishlist-handler");
const {
  getCartItems,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../handlers/cart-handler");
const {
  addOrder,
  getOrders,
  confirmOrderPayment,
} = require("../handlers/order-handler");

router.get("/categories", async (req, res) => {
  const categories = await getCategories();

  res.send(categories);
});

router.get("/brands", async (req, res) => {
  const brands = await getBrands();

  res.send(brands);
});

router.get("/products", async (req, res) => {
  const { searchTerm, categoryId, brandId, sortBy, sortOrder, page, pageSize } =
    req.query;

  const products = await getProductsForListing(
    searchTerm,
    categoryId,
    brandId,
    sortBy,
    sortOrder,
    page,
    pageSize
  );

  res.send(products);
});

router.get("/product/:id", async (req, res) => {
  const id = req.params["id"];

  const product = await getProductById(id);

  res.send(product);
});

router.post("/product/:id/reviews", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    const reviewData = {
      name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    const updatedReviews = await addProductReview(req.params.id, reviewData);

    res.status(201).json({ message: "Review added", reviews: updatedReviews });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/regular-products", async (req, res) => {
  const regularProducts = await getRegularProducts();

  res.send(regularProducts);
});

router.get("/new-products", async (req, res) => {
  const newProducts = await getNewProducts();

  res.send(newProducts);
});

router.get("/featured-products", async (req, res) => {
  const featuredProducts = await getFeaturedProducts();

  res.send(featuredProducts);
});

router.get("/wishlist", async (req, res) => {
  console.log(req.user);

  const userId = req.user.id;

  const items = await getWishlist(userId);

  res.send(items);
});

router.post("/wishlist/:id", async (req, res) => {
  console.log(req.user);

  const userId = req.user.id;
  const productId = req.params.id;

  const item = await addToWishlist(userId, productId);

  res.send(item);
});

router.delete("/wishlist/:id", async (req, res) => {
  console.log(req.user);

  const userId = req.user.id;
  const productId = req.params.id;

  await removeFromWishlist(userId, productId);

  res.send({ message: "Ok" });
});

router.get("/cart", async (req, res) => {
  console.log(req.user);

  const userId = req.user.id;

  const items = await getCartItems(userId);

  res.send(items);
});

router.post("/cart/:id", async (req, res) => {
  console.log(req.user);

  const userId = req.user.id;
  const productId = req.params.id;
  const quantity = req.body.quantity;

  const items = await addToCart(userId, productId, quantity);

  res.send(items);
});

router.delete("/cart/:id", async (req, res) => {
  console.log(req.user);

  const userId = req.user.id;
  const productId = req.params.id;

  await removeFromCart(userId, productId);

  res.send({ message: "Ok" });
});

router.get("/orders", async (req, res) => {
  const userId = req.user.id;

  const order = await getOrders(userId);

  res.send(order);
});

router.post("/order", async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, paymentType, address, totalAmount, paymentIntentId } =
      req.body;

    if (paymentType === "card" && paymentIntentId) {
      const paymentResult = await confirmOrderPayment(paymentIntentId);
      if (!paymentResult.success) {
        return res.status(400).json({ message: "Payment failed" });
      }
    }

    const newOrder = await addOrder(
      userId,
      { items, paymentType, address, totalAmount },
      paymentIntentId
    );

    await clearCart(userId);

    res.json({
      message: "Order Created & Payment Processed!",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
