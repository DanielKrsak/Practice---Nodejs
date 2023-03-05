const factory = require("./handleFactory");
const Tour = require("../models/tourModel");

exports.getAllTours = factory.getAll(Tour);
