//create express server
const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
// routes import
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
connectDb()
  .then(() => {
    console.log("Connection with database is established");
    app.listen(8888, () => {
      console.log("Server is listening on port 8888");
    });
  })
  .catch((error) => {
    console.log(error);
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
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   console.log(userEmail);
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) res.status(404).send("User not found");
//     else res.send(user);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //get all users from mongoDB
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// //delete user by id
// app.delete("/userDelete", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     await User.findByIdAndDelete({ _id: userId });
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });
// //update the user
// app.patch("/updateUser/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   console.log(userId);
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = [
//       "firstName",
//       "lastName",
//       "password",
//       "age",
//       "gender",
//       "photoUrl",
//     ];
//     const isUpdatedAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdatedAllowed) throw new Error("update not allowed");
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });

//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });
