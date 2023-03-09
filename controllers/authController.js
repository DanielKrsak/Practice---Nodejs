const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { promisify } = require("util");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(
      new AppError("Please provide email and password to login."),
      401
    );

  const user = await User.findOne({ email }).populate("password");

  if (!user || !(await user.verifyPassword(password, user.password)))
    return next(new AppError("Email or password incorrect. Try again.", 401));

  sendResToken(res, 200, user._id);
});

exports.protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(
      new AppError("You need to log in to perform this action.", 403)
    );

  const token = req.headers.authorization.split(" ")[1];

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError(
        "User belonging to this token no longer exists. Please sign in.",
        404
      )
    );

  if (user.passwordChangedAfter(decoded.iat))
    return next(
      new AppError(
        "Password has been recently changed. Please log in again to proceed.",
        403
      )
    );

  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(`Sorry, you're unable to perform this action.`, 403)
      );

    next();
  };
};
