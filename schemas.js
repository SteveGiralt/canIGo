const Joi = require("joi");

module.exports.bathroomSchema = Joi.object({
  bathroom: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    occupancy: Joi.string().required().valid("Single", "Multi", "Family"),
  }).required(),
});
