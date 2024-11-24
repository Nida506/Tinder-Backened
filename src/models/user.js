//create schema of database

const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // required: true, now on in code validation
    },
    lastName: {
      type: String,
      // required: true,now on in code validation
    },
    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      // validate(value) {zz
      //   if (!validator.isEmail(value)) {
      //     throw new Error("email is not valid");
      //   }
      // },
    },
    password: {
      type: String,
      // validate(value) {
      //   if (!validator.isStrongPassword(value)) {
      //     throw new Error("Not a strong password");
      //   }
      // },
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "http:photo",
      // validate(value) {
      //   if (!validator.isURL(value)) {
      //     throw new Error("Not  a url");
      //   }
      // },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
