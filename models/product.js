const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    expireBid: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
