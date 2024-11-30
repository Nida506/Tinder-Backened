const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");

//post data to  mongoDB dynamically for sign up
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    //Encrypt the data
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //create new instance of user model

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });
    // save user in database
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//login api
authRouter.post("/signIn", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    //create JWT token
    const token = await user.getJWT();

    res.cookie("token", token);
    res.json(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
//logout api

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfully");
});

module.exports = { authRouter };
