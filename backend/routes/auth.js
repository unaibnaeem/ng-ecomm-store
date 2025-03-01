const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  generateAccessToken,
  generateRefreshToken,
} = require("../handlers/auth-handler");

router.post("/register", async (req, res) => {
  let model = req.body;

  if (model.name && model.email && model.password) {
    await registerUser(model);

    res.send({
      message: "User Registered!",
    });
  } else {
    res.status(400).json({
      error: "Please provide Name, Email and Password.",
    });
  }
});

router.post("/login", async (req, res) => {
  let model = req.body;

  if (model.email && model.password) {
    const result = await loginUser(model);

    if (result) {
      const accessToken = generateAccessToken(result.user);
      const refreshToken = generateRefreshToken(result.user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        domain:
          process.env.NODE_ENV === "production"
            ? "ng-ecomm-store.vercel.app"
            : "localhost",
        path: "/auth/refresh-token",
      });

      res.json({ accessToken, user: result.user });
    } else {
      res.status(400).json({
        error: "Incorrect Email or Password.",
      });
    }
  } else {
    res.status(400).json({
      error: "Please provide Email and Password.",
    });
  }
});

router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(403).json({ error: "Refresh token required" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(decoded);

    res.json({ accessToken: newAccessToken });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { path: "/auth/refresh-token" });
  res.json({ message: "Logged out" });
});

module.exports = router;
