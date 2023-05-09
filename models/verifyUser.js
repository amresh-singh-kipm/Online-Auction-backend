const mongoose = require("mongoose");
const verifyUserSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    uniqueString: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    expireAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("VerifyUser", verifyUserSchema);
