const express = require("express");
const tourController = require("../controllers/tourController");

const router = express.Router();

router
  .route("/top-5-cheapest")
  .get(tourController.topFiveCheapest, tourController.getAllTours);

router.route("/getTourStats").get(tourController.getTourStats);
router.route("/getMonthlyPlan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

module.exports = router;
