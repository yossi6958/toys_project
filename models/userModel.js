const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);
exports.UserModel = mongoose.model("users", UserSchema);

exports.createToken = (user_id, role) => {
  const token = jwt.sign({ _id: user_id, role }, process.env.SECRET_KEY, {
    expiresIn: "600min",
  });
  return token;
};

exports.validateUser = (reqBody) => {
  const JoiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(16).required(),
  });
  return JoiSchema.validate(reqBody);
};

exports.validateLogin = (reqBody) => {
  const JoiSchema = Joi.object({
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(16).required(),
  });
  return JoiSchema.validate(reqBody);
};