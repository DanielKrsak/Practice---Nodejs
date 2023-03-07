const catchAsync = require("../utils/catchAsync");
const AppFeatures = require("../utils/appFeatures");
const User = require("../models/userModel");

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const features = new AppFeatures(Model, req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      requestedAt: req.requestedAt,
      data: {
        data: doc,
      },
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};
