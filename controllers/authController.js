const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

dotenv.config({ path: "../config.env" });

const sendResToken = async (res, statusCode, id) => {
  const token = await signJWT(id);

  const user = await User.findById(id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signJWT = async (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

exports.signIn = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  sendResToken(res, 201, newUser._id);
});
