const Order = require("../db/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function getOrders(userId) {
  let orders = await Order.find({ userId: userId }).populate(
    "userId",
    "name email"
  );

  return orders.map((order) => order.toObject());
}

async function addOrder(userId, model, paymentIntentId = null) {
  let orderStatus = "Processing";

  let paymentStatus =
    model.paymentType === "card" && paymentIntentId ? "Paid" : "Pending";

  let order = new Order({
    ...model,
    userId: userId,
    status: orderStatus,
    paymentIntentId: paymentIntentId,
    paymentStatus: paymentStatus,
  });

  await order.save();
  return order;
}

async function createStripePaymentIntent(amount, currency = "usd") {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency,
      payment_method_types: ["card"],
    });
    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    throw error;
  }
}

async function confirmOrderPayment(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntentId },
        { status: "Paid" }
      );
      return { success: true, message: "Payment successful!" };
    }
    return { success: false, message: "Payment not completed yet." };
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    throw error;
  }
}

async function getAllOrders() {
  let orders = await Order.find().populate("userId", "name email");

  return orders.map((order) => order.toObject());
}

async function updateOrderStatus(id, status) {
  await Order.findByIdAndUpdate(id, {
    status: status,
  });
}

async function deleteOrder(id) {
  await Order.findByIdAndDelete(id);
}

module.exports = {
  getOrders,
  addOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  createStripePaymentIntent,
  confirmOrderPayment,
};
