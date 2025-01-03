const express = require("express");
const Review = require("../models/Review");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/addreview", authenticate, async (req, res) => {
  try {
    const review = new Review({
      rating: req.body.rating,
      comment: req.body.comment,
      user: req.user.id,
      location: req.body.location,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status().json({ message: "Error adding review", error: err.message });
  }
});

router.get("/:locationId", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access forbidden: Admin role required" });
    }
    const reviews = await Review.find({
      location: req.params.locationId,
    }).populate("user", "username");
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: err.message });
  }
});

router.delete("/:locationID/:reviewID", authenticate, async (req, res) => {
  try {
    const { locationID, reviewID } = req.params;

    const review = await Review.findOne({
      _id: reviewID,
      location: locationID,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
});

module.exports = router;
