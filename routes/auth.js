const express = require("express");
const bcrypt = require("bcrypt");
const user = require("../models/User");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = process.env;

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, // Include role in token
      process.env.ACCESS_TOKEN_SECRET
    );

    if (user.role === "admin") {
      res.json({ message: "Login successful as Admin", token });
    } else {
      res.json({ message: "Login successful", token });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

module.exports = router;
