const express = require("express");
const Location = require("../models/Location");
const Restaurant = require("../models/Restaurant");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/addlocation", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access forbidden: Admin role required" });
    }

    const location = new Location({
      area: req.body.area,
      district: req.body.district,
      state: req.body.state,
      restaurants: req.body.restaurants || [],
    });

    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding location", error: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { area } = req.query;
  try {
    const location = await Location.findOne({
      area: { $regex: area, $options: "i" },
    });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const restaurants = await Restaurant.find({ location: location._id });

    res.json({ location, restaurants });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error searching location and restaurants",
        error: err.message,
      });
  }
});

module.exports = router;
