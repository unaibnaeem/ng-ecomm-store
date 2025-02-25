const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  date: { type: Date, default: Date.now },
  items: [mongoose.Schema.Types.Mixed],
  paymentType: {
    type: String,
    enum: ["cashOnDelivery", "card"],
    required: true,
  },
  paymentIntentId: { type: String, default: null },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  address: mongoose.Schema.Types.Mixed,
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
