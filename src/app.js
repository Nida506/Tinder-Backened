//create express server
const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
// routes import
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:8213",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("Connection with database is established");
    app.listen(8213, () => {
      console.log("Server is listening on port 8213");
    });
  })
  .catch((error) => {
    console.log(error);
  });
