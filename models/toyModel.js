const mongoose = require("mongoose");
const Joi = require("joi");

const ToySchema = new mongoose.Schema(
  {
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    user_id: String,
  },
  { timestamps: true }
);
exports.ToyModel = mongoose.model("toys", ToySchema);

exports.validateToys = (reqBody) => {
  const JoiSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    info: Joi.string().min(2).max(100).required(),
    category: Joi.string().min(2).max(20).required(),
    img_url: Joi.string().min(2).max(999).allow(null, ""),
    price: Joi.number().min(1).max(99999).required(),
  });
  return JoiSchema.validate(reqBody);
};
