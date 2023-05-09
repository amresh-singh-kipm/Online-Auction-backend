const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    verified:{
      type:Boolean
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("User",userSchema)
