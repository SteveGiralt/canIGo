const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { reviewSchema } = require("../schemas.js");
const Bathroom = require("../models/bathroom");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id);
    const review = new Review(req.body.review);
    bathroom.reviews.push(review);
    await review.save();
    await bathroom.save();
    req.flash("success", "Thanks for your feedback!");
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Bathroom.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted :(");
    res.redirect(`/bathrooms/${id}`);
  })
);

module.exports = router;
