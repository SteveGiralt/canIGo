const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const BathroomSchema = new Schema({
  title: String,
  occupancy: String,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

BathroomSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Bathroom", BathroomSchema);
