const mongoose = require("mongoose");

const buyerSchema = mongoose.Schema(
  {
    userId: {
      type: Object,
      required: true,
    },
    productId: {
      type: Object,
      required: true,
    },
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
    my_bid: {
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
    isBidSuccess: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Mybid", buyerSchema);
