const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Tour must have a name."],
      minLength: [10, "Tour name must be at least 10 characters long."],
      maxLength: [50, "Tour name must have less than 50  characters."],
      unique: true,
    },
    slug: String,
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds.`);
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
