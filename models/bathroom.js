const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BathroomSchema = new Schema({
  title: String,
  occupancy: String,
  description: String,
  location: String,
  image: String,
});

module.exports = mongoose.model("Bathroom", BathroomSchema);
