const express = require("express");
const app = express();
app.listen(3000, () => {
  console.log("successfully connect");
});
app.use("/", (req, res) => {
  console.log("Hello from the serever");
});
