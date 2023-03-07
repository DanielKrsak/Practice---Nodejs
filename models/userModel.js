const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please tell us your name."],
    },
    photo: String,
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "Invalid email address. Try again."],
      required: [true, "Please provide your email."],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long."],
      required: [true, "Please provide your password."],
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords must match. Try again!",
      },
      required: [true, "Please confirm your password."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
