const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../handlers/order-handler");

router.get("", async (req, res) => {
  const orders = await getAllOrders();

  res.send(orders);
});

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  await updateOrderStatus(id, status);

  res.send({ message: "Status Updated!" });
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await deleteOrder(id);

    res.send({ message: "Order Deleted!" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete order" });
  }
});

module.exports = router;
