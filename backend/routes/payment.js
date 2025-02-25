const express = require("express");
const router = express.Router();

const { createStripePaymentIntent } = require("../handlers/order-handler");

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const clientSecret = await createStripePaymentIntent(amount);

    res.json({ clientSecret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
