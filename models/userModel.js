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
    role: {
      type: String,
      enum: {
        values: ["user", "guide", "lead-guide", "admin"],
        message:
          "Invalid role. Please select one of the following user, guide, lead-guide, admin",
      },
      default: "user",
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
      select: false,
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
    passwordChangeAt: Date,
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

userSchema.methods.verifyPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.passwordChangedAfter = function (JWT) {
  if (this.passwordChangeAt) {
    return JWT < parseInt(this.passwordChangeAt.getTime() / 1000, 10);
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
