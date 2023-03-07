const factory = require("./handleFactory");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);
