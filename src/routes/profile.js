const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

//get profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    console.log(req);
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//edit profile api
profileRouter.get("/profile/edit", userAuth, async (req, res) => {
  console.log(validateEditProfileData(req));
  try {
    if (!validateEditProfileData(req)) throw new Error("Invalid edit  request");
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send({
      message: `${loggedInUser.firstName} , your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = { profileRouter };
