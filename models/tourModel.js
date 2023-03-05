const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Tour must have a name."],
    minLength: [10, "Tour name must be at least 10 characters long."],
    maxLength: [50, "Tour name must have less than 50  characters."],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, "Tour must have a duration."],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour must have a maximum group size."],
  },
  difficulty: {
    type: String,
    required: [true, "Tour must have a duration."],
    enum: {
      values: ["easy", "medium", "difficult"],
      message:
        "Please select one of the following difficulties:  easy, medium, or difficult.",
    },
  },
  ratingsAverage: {
    type: Number,
    min: [1, "Rating must be at least 1."],
    max: [5, "Rating can't be higher than 5."],
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Tour must have a price."],
  },
  discountPrice: {
    type: Number,
    validate: {
      validator: function (v) {
        return v < this.price && v > 0;
      },
      message: "Discount price must be lower than original price.",
    },
  },
  summary: {
    type: String,
    required: [true, "Tour must have a summary."],
  },
  imageCover: String,
  images: [String],
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
