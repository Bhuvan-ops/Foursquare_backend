const express = require("express");
const Restaurant = require("../models/Restaurant");
const Location = require("../models/Location");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/:area/addrestaurant", authenticate, async (req, res) => {
  try {
    const { name, cuisine, rating } = req.body;
    const { area } = req.params;

    const location = await Location.findOne({
      area: { $regex: area, $options: "i" },
    });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const restaurant = new Restaurant({
      name,
      cuisine,
      rating,
      location: location._id,
    });

    await restaurant.save();

    location.restaurants.push(restaurant._id);
    await location.save();

    res
      .status(201)
      .json({ message: "Restaurant added successfully", restaurant });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding restaurant", error: err.message });
  }
});

module.exports = router;
