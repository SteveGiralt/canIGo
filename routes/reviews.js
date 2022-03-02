const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");

const Bathroom = require("../models/bathroom");
const Review = require("../models/review");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    bathroom.reviews.push(review);
    await review.save();
    await bathroom.save();
    req.flash("success", "Thanks for your feedback!");
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Bathroom.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted :(");
    res.redirect(`/bathrooms/${id}`);
  })
);

module.exports = router;
