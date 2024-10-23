const express = require("express");
const app = express();
app.listen(8888, () => {
  console.log("successfully connect");
});

app.get("/user", (req, res) => {
  res.send({ firstName: "Nida", lastName: "Waheed" });
});
app.post("/user", (req, res) => {
  console.log("save data to database");
  res.send("Data saved to the database successfully");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfullly");
});
app.use("/test", (req, res) => {
  res.send("Ok");
});
