const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const passport = require("passport");

const {
  renderRegister,
  registerUser,
  renderLogin,
  loginUser,
  logoutUser,
} = require("../controllers/users");

router.route("/register").get(renderRegister).post(catchAsync(registerUser));

router
  .route("/login")
  .get(renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    loginUser
  );

router.get("/logout", logoutUser);

module.exports = router;
