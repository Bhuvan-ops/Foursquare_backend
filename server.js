require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/locations");
const reviewRoutes = require("./routes/reviews");
const restaurantRoutes = require("./routes/restaurants");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/locations", locationRoutes);
app.use("/reviews", reviewRoutes);
app.use("/restaurants", restaurantRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
