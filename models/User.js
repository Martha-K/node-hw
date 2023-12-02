import { Schema, model } from "mongoose";
import Joi from "joi";
import { handeleSaveError, preUpdate } from "./hooks.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: { type: String },
  },
  { versionKey: false }
);

userSchema.post("save", handeleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handeleSaveError);

export const userSignupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
});

export const userSigninSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const User = model("user", userSchema);

export default User;
