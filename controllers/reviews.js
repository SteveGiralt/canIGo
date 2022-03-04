const Bathroom = require("../models/bathroom");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const bathroom = await Bathroom.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  bathroom.reviews.push(review);
  await review.save();
  await bathroom.save();
  req.flash("success", "Thanks for your feedback!");
  res.redirect(`/bathrooms/${bathroom._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Bathroom.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted :(");
  res.redirect(`/bathrooms/${id}`);
};
