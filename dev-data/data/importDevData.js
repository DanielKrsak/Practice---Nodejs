const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const catchAsync = require("../../utils/catchAsync");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DB_URL.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("Successfully connected to the database"));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully imported!");
  } catch (err) {
    console.log(err);
    console.log("Failed importing data!");
  }
  process.exit();
};
const deleteData = catchAsync(async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
    console.log("Failed deleting data!");
  }
  process.exit();
});

if (process.argv[2] === "--import") importData();
if (process.argv[2] === "--delete") deleteData();
