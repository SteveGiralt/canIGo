const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome, ${username}!`);
      res.redirect("/bathrooms");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.userLogin = (req, res) => {
  const { username } = req.body;
  req.flash("success", `Welcome Back, ${username}!`);
  const redirectUrl = req.session.returnTo || "/bathrooms";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/bathrooms");
};
