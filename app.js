const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Bathroom = require("./models/bathroom");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const occupancies = ["Single", "Multi", "Family"];

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res) => {
  res.render("home");
});

app.post(
  "/bathrooms",
  catchAsync(async (req, res, next) => {
    if (!req.body.bathroom)
      throw new ExpressError("Invalid Bathroom Data", 400);
    const bathroom = new Bathroom(req.body);
    await bathroom.save();
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

app.get(
  "/bathrooms",
  catchAsync(async (req, res) => {
    const bathrooms = await Bathroom.find({});
    res.render("bathrooms/index", { bathrooms });
  })
);

app.get("/bathrooms/new", (req, res) => {
  res.render("bathrooms/new", { occupancies });
});

app.get(
  "/bathrooms/:id",
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id);
    res.render("bathrooms/show", { bathroom });
  })
);

app.get(
  "/bathrooms/:id/edit",
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id);
    res.render("bathrooms/edit", { bathroom, occupancies });
  })
);

app.put(
  "/bathrooms/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const bathroom = await Bathroom.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

app.delete(
  "/bathrooms/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const bathroom = await Bathroom.findByIdAndDelete(id);
    res.redirect("/bathrooms");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found... bummer", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "That's an error...";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
