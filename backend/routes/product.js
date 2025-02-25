const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteProductReview,
} = require("../handlers/product-handler");

router.post("", async (req, res) => {
  let model = req.body;

  let result = await addProduct(model);

  res.send(result);
});

router.get("", async (req, res) => {
  let results = await getProducts();

  res.send(results);
});

router.get("/:id", async (req, res) => {
  let id = req.params["id"];

  let result = await getProductById(id);

  res.send(result);
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id/reviews/:reviewId", async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const updatedReviews = await deleteProductReview(id, reviewId);

    res.json({
      message: "Review deleted successfully",
      reviews: updatedReviews,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  let id = req.params["id"];
  let model = req.body;

  await updateProduct(id, model);

  res.send({ message: "Updated" });
});

router.delete("/:id", async (req, res) => {
  let id = req.params["id"];

  await deleteProduct(id);

  res.send({ message: "Deleted" });
});

module.exports = router;
