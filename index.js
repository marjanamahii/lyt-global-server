const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

//middleware
app.use(express.json({ limit: "25mb" }));
// app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// image
// const uploadImage = require("./src/Utils/uploadImage");

// all routes
const authRoutes = require("./src/Users/user.route");
// const productRoutes = require("./src/Products/products.route");
// const reviewRoutes = require("./src/Reviews/reviews.route");
// const orderRoutes = require("./src/Orders/orders.route");
// const statsRoutes = require("./src/Stats/stats.route");

app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/stats", statsRoutes);

main()
  .then(() => console.log("Mongodb is Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);

  app.get("/", (req, res) => {
    res.send("This is LYT Global Clothing Server");
  });
}

// app.post("/uploadImage", (req, res) => {
//   uploadImage(req.body.image)
//     .then((url) => res.send(url))
//     .catch((err) => res.status(500).send(err));
// });

app.listen(port, () => {
  console.log(`LYT Global is listening on port ${port}`);
});
