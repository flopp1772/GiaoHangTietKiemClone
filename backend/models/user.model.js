import { Schema } from "mongoose";
import mongoose from "mongoose";

const addressSchema = new Schema({
  street: String,
  city: String,
  district: String,
  ward: String,
  road: String,
});

const userSchema = new Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is invalid'],
    },
    img: {
      type: String,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    // New fields from the image
    storeName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: addressSchema,
    agreedToTerms: {
      type: Boolean,
      default: false,
    },
    needHelp: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);