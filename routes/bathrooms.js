const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Bathroom = require("../models/bathroom");
const occupancies = ["Single", "Multi", "Family"];
const { isLoggedIn, validateBathroom, isAuthor } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const bathrooms = await Bathroom.find({});
    res.render("bathrooms/index", { bathrooms });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("bathrooms/new", { occupancies });
});

router.post(
  "/",
  isLoggedIn,
  validateBathroom,
  catchAsync(async (req, res, next) => {
    const bathroom = new Bathroom(req.body.bathroom);
    bathroom.author = req.user._id;
    await bathroom.save();
    req.flash("success", "Bathroom successfully added!");
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!bathroom) {
      req.flash("error", "That bathroom wasn't found!");
      return res.redirect("/bathrooms");
    }
    res.render("bathrooms/show", { bathroom });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id);
    if (!bathroom) {
      req.flash("error", "That bathroom wasn't found!");
      return res.redirect("/bathrooms");
    }
    res.render("bathrooms/edit", { bathroom, occupancies });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateBathroom,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const bathroom = await Bathroom.findByIdAndUpdate(id, {
      ...req.body.bathroom,
    });
    req.flash("success", "Bathroom updated!");
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Bathroom.findByIdAndDelete(id);
    req.flash("success", "Bathroom Deleted (You'll have to hold it!)");
    res.redirect("/bathrooms");
  })
);

module.exports = router;
