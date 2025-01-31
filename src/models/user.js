//create schema of database

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
// const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      // require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // require: true,
    },
    age: {
      type: String,
      maxLength: 3,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://staging.svgrepo.com/show/390455/user-person-account-avatar-profile-man.svg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Not  a url");
        }
      },
    },
    about: {
      type: String,
      default: "I am user of tinder website ...",
      minLength: 10,
      maxLength: 150,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length >= 10)
          throw new Error("Exceeds the limit of 10 skills");
      },
    },
  },

  {
    timestamps: true,
  }
);

//helper functions

//for jWt token helper function
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Flicke@Tinder$790", {
    expiresIn: "7d",
  });
  return token;
};

//for password encryption helper function
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
