const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Bathroom = require("../models/bathroom");
const { bathroomSchema } = require("../schemas.js");
const occupancies = ["Single", "Multi", "Family"];
const { isLoggedIn } = require("../middleware");

const validateBathroom = (req, res, next) => {
  const { error } = bathroomSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
    // if (!req.body.bathroom) throw new ExpressError('Invalid Bathroom Data', 400);
    const bathroom = new Bathroom(req.body.bathroom);
    await bathroom.save();
    req.flash("success", "Bathroom successfully added!");
    res.redirect(`/bathrooms/${bathroom._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const bathroom = await Bathroom.findById(req.params.id).populate("reviews");
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Bathroom.findByIdAndDelete(id);
    req.flash("success", "Bathroom Deleted (You'll have to hold it!)");
    res.redirect("/bathrooms");
  })
);

module.exports = router;
