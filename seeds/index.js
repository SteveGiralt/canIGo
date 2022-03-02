const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors, occupancy } = require("./seedHelpers");
const Bathroom = require("../models/bathroom");

mongoose
  .connect("mongodb://localhost:27017/canigo")
  .then(() => {
    console.log("Mongo Connection Open...");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION ERROR!");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Bathroom.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const bath = new Bathroom({
      author: "621ee9394e1881a2f377465b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      occupancy: `${sample(occupancy)}`,
      image: "https://source.unsplash.com/collection/93525116",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe est aspernatur placeat itaque optio consectetur unde. Tempore repellendus a, iusto earum placeat aperiam! Facere quod voluptatum ea? Libero, sunt debitis!",
    });
    await bath.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
