const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateBathroom, isAuthor } = require("../middleware");
const bathrooms = require("../controllers/bathrooms");

router.route("/").get(catchAsync(bathrooms.index)).post(
  isLoggedIn,
  upload.array("image"),
  validateBathroom,

  catchAsync(bathrooms.createBathroom)
);

router.get("/new", isLoggedIn, bathrooms.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(bathrooms.renderEditForm)
);

router
  .route("/:id")
  .get(catchAsync(bathrooms.showBathroom))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateBathroom,
    catchAsync(bathrooms.editBathroom)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(bathrooms.deleteBathroom));

module.exports = router;
