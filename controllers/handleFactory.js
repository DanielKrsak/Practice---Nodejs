const catchAsync = require("../utils/catchAsync");

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    res.status(200).json({
      status: "success",
      results: doc.length,
      requestedAt: req.requestedAt,
      doc,
    });
  });
};
