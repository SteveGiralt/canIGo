const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateBathroom, isAuthor } = require("../middleware");
const bathrooms = require("../controllers/bathrooms");

router.get("/", catchAsync(bathrooms.index));

router.get("/new", isLoggedIn, bathrooms.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateBathroom,
  catchAsync(bathrooms.createBathroom)
);

router.get("/:id", catchAsync(bathrooms.showBathroom));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(bathrooms.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateBathroom,
  catchAsync(bathrooms.editBathroom)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(bathrooms.deleteBathroom)
);

module.exports = router;
