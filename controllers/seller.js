const Bidder = require("../models/bidder");
exports.getSellerDetails = (req, res, next, _id) => {
    // console.log("first",{ productId })
    Bidder.findOne({productId: _id })
      .then((result) => {
        console.log("result",result)
        req.seller = result;
        next();
      })
      .catch(() => {
        res.status(400).send({
          message: "Bidder not found",
        });
      });
  };
