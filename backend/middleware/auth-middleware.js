const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied! No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Access Denied! Invalid token format." });
  }

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decode from auth-middleware", decode);
    req.user = decode;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired! Please refresh your session." });
    }
    return res.status(401).send({
      error: "Invalid or Expired Token!",
    });
  }
}

function isAdmin(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "Unauthorized! Token missing or invalid." });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden! Admin access required." });
  }

  next();
}

module.exports = { verifyToken, isAdmin };
