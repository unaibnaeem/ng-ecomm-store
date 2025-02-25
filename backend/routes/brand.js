const express = require("express");
const router = express.Router();

const {
  addBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../handlers/brand-handler");

router.post("", async (req, res) => {
  let model = req.body;

  let result = await addBrand(model);

  res.send(result);
});

router.get("", async (req, res) => {
  let results = await getBrands();

  res.send(results);
});

router.get("/:id", async (req, res) => {
  let id = req.params["id"];

  let result = await getBrandById(id);

  res.send(result);
});

router.put("/:id", async (req, res) => {
  let id = req.params["id"];
  let model = req.body;

  await updateBrand(id, model);

  res.send({ message: "Updated" });
});

router.delete("/:id", async (req, res) => {
  let id = req.params["id"];

  await deleteBrand(id);

  res.send({ message: "Deleted" });
});

module.exports = router;
