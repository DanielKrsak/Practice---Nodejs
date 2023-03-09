const Review = require("../models/reviewModel");
const factory = require("../controllers/handleFactory");

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
