const Cart = require("../db/cart");

async function getCartItems(userId) {
  const products = await Cart.find({ userId: userId }).populate("productId");

  return products.map((x) => {
    return { product: x.productId, quantity: x.quantity };
  });
}

async function addToCart(userId, productId, quantity) {
  let product = await Cart.findOne({
    userId: userId,
    productId: productId,
  });

  if (product) {
    if (product.quantity + quantity == 0) {
      await removeFromCart(userId, productId);
    } else {
      await Cart.findByIdAndUpdate(product._id, {
        quantity: product.quantity + quantity,
      });
    }
  } else {
    product = new Cart({
      userId: userId,
      productId: productId,
      quantity: quantity,
    });

    product.save();
  }
}

async function removeFromCart(userId, productId) {
  await Cart.findOneAndDelete({
    userId: userId,
    productId: productId,
  });
}

async function clearCart(userId) {
  await Cart.deleteMany({
    userId: userId,
  });
}

module.exports = { getCartItems, addToCart, removeFromCart, clearCart };
