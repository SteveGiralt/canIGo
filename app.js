const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { bathroomSchema, reviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Bathroom = require("./models/bathroom");
const Review = require("./models/review");
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

const validateBathroom = (req, res, next) => {
  const { error } = bathroomSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});
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

app.post(
  "/bathrooms",
  validateBathroom,
  catchAsync(async (req, res, next) => {
    // if (!req.body.bathroom) throw new ExpressError('Invalid Bathroom Data', 400);
    const bathroom = new Bathroom(req.body.bathroom);
    await bathroom.save();
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

app.get(
  "/bathrooms/:id",
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id).populate("reviews");
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
  validateBathroom,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const bathroom = await Bathroom.findByIdAndUpdate(id, {
      ...req.body.bathroom,
    });
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

app.delete(
  "/bathrooms/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Bathroom.findByIdAndDelete(id);
    res.redirect("/bathrooms");
  })
);

app.post(
  "/bathrooms/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id);
    const review = new Review(req.body.review);
    bathroom.reviews.push(review);
    await review.save();
    await bathroom.save();
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

app.delete(
  "/bathrooms/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Bathroom.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/bathrooms/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
