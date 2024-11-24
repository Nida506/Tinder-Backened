const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    console.log(User);
    //read token from the cookies (attack with request)
    const { token } = req.cookies;

    // validate the token
    if (!token) throw new Error("Token not valid");
    // find the user
    const decodedObj = await jwt.verify(token, "Flicke@Tinder$790");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
