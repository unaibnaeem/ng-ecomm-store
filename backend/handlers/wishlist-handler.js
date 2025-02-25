const Wishlist = require("../db/wishlist");

async function getWishlist(userId) {
  let wishlist = await Wishlist.find({ userId: userId }).populate("productId");

  return wishlist.map((list) => list.toObject().productId);
}

async function addToWishlist(userId, productId) {
  const wishlist = new Wishlist({
    userId: userId,
    productId: productId,
  });

  await wishlist.save();

  return wishlist.toObject();
}

async function removeFromWishlist(userId, productId) {
  await Wishlist.deleteMany({
    userId: userId,
    productId: productId,
  });
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
