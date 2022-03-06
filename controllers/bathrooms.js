const Bathroom = require("../models/bathroom");

const occupancies = ["Single", "Multi", "Family"];

module.exports.index = async (req, res) => {
  const bathrooms = await Bathroom.find({});
  res.render("bathrooms/index", { bathrooms });
};

module.exports.renderNewForm = (req, res) => {
  res.render("bathrooms/new", { occupancies });
};

module.exports.createBathroom = async (req, res, next) => {
  const bathroom = new Bathroom(req.body.bathroom);
  bathroom.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  bathroom.author = req.user._id;
  await bathroom.save();
  console.log(bathroom);
  req.flash("success", "Bathroom successfully added!");
  res.redirect(`/bathrooms/${bathroom._id}`);
};

module.exports.showBathroom = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const bathroom = await Bathroom.findById(req.params.id);
  if (!bathroom) {
    req.flash("error", "That bathroom wasn't found!");
    return res.redirect("/bathrooms");
  }
  res.render("bathrooms/edit", { bathroom, occupancies });
};

module.exports.editBathroom = async (req, res) => {
  const { id } = req.params;

  const bathroom = await Bathroom.findByIdAndUpdate(id, {
    ...req.body.bathroom,
  });
  req.flash("success", "Bathroom updated!");
  res.redirect(`/bathrooms/${bathroom._id}`);
};

module.exports.deleteBathroom = async (req, res) => {
  const { id } = req.params;
  await Bathroom.findByIdAndDelete(id);
  req.flash("success", "Bathroom Deleted (You'll have to hold it!)");
  res.redirect("/bathrooms");
};
