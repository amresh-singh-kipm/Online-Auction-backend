const mongoose = require("mongoose");

const bidderSchema = mongoose.Schema(
  {
    sellerId: {
      type: Object,
      trim: true,
    },
    productId: {
      type: Object,
      trim: true,
    },
    bidderList: {
      type: Array,
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Bidder", bidderSchema);
