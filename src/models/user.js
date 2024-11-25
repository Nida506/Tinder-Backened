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
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    age: {
      type: String,
      maxLength: 3,
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
      default:
        "https://www.google.com/imgres?q=images&imgurl=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1664474619075-644dd191935f%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%253D&imgrefurl=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fimage&docid=ExDvm63D_wCvSM&tbnid=2brKLR3s5kTpPM&vet=12ahUKEwjD-sfQlveJAxU0SaQEHWmHDDsQM3oFCIMBEAA..i&w=3000&h=2003&hcb=2&ved=2ahUKEwjD-sfQlveJAxU0SaQEHWmHDDsQM3oFCIMBEAA",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Not  a url");
        }
      },
    },
    about: {
      type: String,
      default: "I am user of that website...",
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
