const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/top-5-cheapest")
  .get(tourController.topFiveCheapest, tourController.getAllTours);

router.route("/getTourStats").get(tourController.getTourStats);
router.route("/getMonthlyPlan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    tourController.getAllTours
  )
  .post(tourController.createTour);

module.exports = router;
