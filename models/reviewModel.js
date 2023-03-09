const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Please tell us what you think about this tour."],
  },
  rating: {
    type: Number,
    min: [1, "Rating cannot be lower than 1."],
    max: [5, "Rating cannot be higher than 5."],
    required: [true, "Please don't forget to rate this tour."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
