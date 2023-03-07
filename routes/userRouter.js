const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route("/signin").post(authController.signIn);

module.exports = router;
