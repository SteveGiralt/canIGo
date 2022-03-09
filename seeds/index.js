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
      geometry: { type: "Point", coordinates: [-147.7164, 64.8378] },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      occupancy: `${sample(occupancy)}`,
      images: [
        {
          url: "https://res.cloudinary.com/canigo/image/upload/v1646605942/canIGo/pk4zzzkfcree5net4ulh.jpg",
          filename: "canIGo/pk4zzzkfcree5net4ulh",
        },
        {
          url: "https://res.cloudinary.com/canigo/image/upload/v1646605942/canIGo/aimxzcukd8rez2glru3l.jpg",
          filename: "canIGo/aimxzcukd8rez2glru3l",
        },
        {
          url: "https://res.cloudinary.com/canigo/image/upload/v1646605942/canIGo/yzbnsct2q3ls0qyrxlcv.jpg",
          filename: "canIGo/yzbnsct2q3ls0qyrxlcv",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe est aspernatur placeat itaque optio consectetur unde. Tempore repellendus a, iusto earum placeat aperiam! Facere quod voluptatum ea? Libero, sunt debitis!",
    });
    await bath.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
