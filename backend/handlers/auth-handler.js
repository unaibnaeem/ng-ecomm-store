const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(model) {
  const hashPassword = await bcrypt.hash(model.password, 10);

  let user = new User({
    name: model.name,
    email: model.email,
    password: hashPassword,
  });

  await user.save();
}

async function loginUser(model) {
  const user = await User.findOne({ email: model.email });
  const isPasswordMatched = await bcrypt.compare(model.password, user.password);

  if (!user) return null;

  if (user && isPasswordMatched) {
    let token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      "secretToken",
      { expiresIn: "30d" }
    );

    return { token, user };
  } else {
    return null;
  }
}

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}

module.exports = {
  registerUser,
  loginUser,
  generateAccessToken,
  generateRefreshToken,
};
