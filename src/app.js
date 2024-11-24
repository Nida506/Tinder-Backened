//create express server
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectDb } = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const { User } = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
//post data to  mongoDB dynamically
app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    //Encrypt the data
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //create new instance of user model

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    // save user in database
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/signIn", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    //create JWT token
    const token = await jwt.sign({ _id: user._id }, "Flicke@Tinder$790");

    res.cookie("token", token);
    res.send("Login Successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    console.log(req);
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
// //get user  from mongoDb by emailID
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   console.log(userEmail);
//   try {
//     const user = await User.find({ emailId: userEmail });
//     if (!user) res.status(404).send("User not found");
//     else res.send(user);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

//get user  from mongoDb by emailID if two emailID return just one document which comes first in mongoDB
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(userEmail);
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) res.status(404).send("User not found");
    else res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//get all users from mongoDB
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete user by id
app.delete("/userDelete", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
//update the user
app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req.params?.userId;
  console.log(userId);
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
    ];
    const isUpdatedAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdatedAllowed) throw new Error("update not allowed");
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Connection with database is established");
    app.listen(8888, () => {
      console.log("Server is listening port 8888");
    });
  })
  .catch((error) => {
    console.log(error);
  });
