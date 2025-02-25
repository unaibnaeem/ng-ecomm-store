require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { verifyToken, isAdmin } = require("./middleware/auth-middleware");

const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customer");
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.use("/auth", authRoutes);
app.use("/", verifyToken, customerRoutes);
app.use("/payment", verifyToken, paymentRoutes);
app.use("/category", verifyToken, isAdmin, categoryRoutes);
app.use("/brand", verifyToken, isAdmin, brandRoutes);
app.use("/product", verifyToken, isAdmin, productRoutes);
app.use("/all-orders", verifyToken, isAdmin, orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodb Connected");
  } catch (err) {
    console.error("MongoDB Connection Failed!", err);
    process.exit(1);
  }
}

connectDb();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
