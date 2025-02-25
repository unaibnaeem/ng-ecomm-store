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

app.use("/auth", authRoutes);
app.use("/", verifyToken, customerRoutes);
app.use("/payment", verifyToken, paymentRoutes);
app.use("/category", verifyToken, isAdmin, categoryRoutes);
app.use("/brand", verifyToken, isAdmin, brandRoutes);
app.use("/product", verifyToken, isAdmin, productRoutes);
app.use("/all-orders", verifyToken, isAdmin, orderRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function connectDb() {
  await mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "ng-e-comm-store-db",
  });
  console.log("Mongodb Connected");
}

connectDb().catch((err) => {
  console.error(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
