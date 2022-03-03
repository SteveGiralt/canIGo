const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateBathroom, isAuthor } = require("../middleware");
const bathrooms = require("../controllers/bathrooms");

router
  .route("/")
  .get(catchAsync(bathrooms.index))
  .post(isLoggedIn, validateBathroom, catchAsync(bathrooms.createBathroom));

router
  .route("/:id")
  .get(catchAsync(bathrooms.showBathroom))
  .put(
    isLoggedIn,
    isAuthor,
    validateBathroom,
    catchAsync(bathrooms.editBathroom)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(bathrooms.deleteBathroom));

router.get("/new", isLoggedIn, bathrooms.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(bathrooms.renderEditForm)
);

module.exports = router;
