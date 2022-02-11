const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Bathroom = require("./models/bathroom");

mongoose
  .connect("mongodb://localhost:27017/canigo")
  .then(() => {
    console.log("Mongo Connection Open...");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR!");
    console.log(err);
  });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/bathrooms", async (req, res) => {
  const bathrooms = await Bathroom.find({});
  res.render("bathrooms/index", { bathrooms });
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
