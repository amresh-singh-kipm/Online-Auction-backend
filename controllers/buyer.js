const Bidder = require("../models/bidder");
const Mybid = require("../models/buyer");
const { validationResult } = require("express-validator");

exports.getMyBidProductById = (req, res, next, _id) => {
  Mybid.findOne({ _id })
    .then((product) => {
      req.bidProduct = product;
      next();
    })
    .catch(() => {
      res.status(400).send({
        message: "Product not found",
      });
    });
};

exports.placeBid = (req, res) => {
  const errors = validationResult(req);
  const userId = req.user._id;
  const { my_bid } = req.body;
  const productDetails = req.product;
  const { _id, name, description, image, price, location } = productDetails;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array[0].msg,
    });
  }
  Mybid.findOne({ userId: userId })
    .then((user) => {
      if (user) {
        console.log("user is found", user);
        Mybid.findOne({ productId: _id })
          .then((result) => {
            if (result) {
              res.status(400).json({
                message: "You have already placed a bid",
              });
            } else {
              const myBid = new Mybid({
                userId: userId,
                productId: _id,
                name: name,
                description: description,
                image: image,
                price: price,
                location: location,
                my_bid: my_bid,
                isBidSuccess: false,
              });
              myBid
                .save()
                .then((result) => {
                  if (result) {
                    Bidder.findOne({ productId: _id }).then((seller) => {
                      const { sellerId, productId } = seller;
                      if (result) {
                        const bidder = new Bidder({
                          sellerId: sellerId,
                          productId: productId,
                          bidderList: userId,
                        });
                        bidder
                          .save() 
                          .then(() => {
                            res.json({
                              result,
                              message: "Bid placed",
                            });
                          })
                          .catch((error) => {
                            res.status(400).json({
                              message: "Error while placing bid",
                            });
                          });
                      }
                    });
                  }
                })
                .catch((err) => {
                  res.status(400).json({
                    error: err,
                  });
                });
            }
          })
          .catch((err) => {
            res.status(400).json({
              error: err,
            });
          });
      } else {
        const myBid = new Mybid({
          userId: userId,
          productId: _id,
          name: name,
          description: description,
          image: image,
          price: price,
          location: location,
          my_bid: my_bid,
          isBidSuccess: false,
        });
        myBid
          .save()
          .then((result) => {
            if (result) {
              Bidder.findOne({ productId: _id }).then((seller) => {
                const { sellerId, productId } = seller;
                if (result) {
                  const bidder = new Bidder({
                    sellerId: sellerId,
                    productId: productId,
                    bidderList: userId,
                  });
                  bidder
                    .save()
                    .then(() => {
                      res.json({
                        result,
                        message: "Bid placed",
                      });
                    })
                    .catch((error) => {
                      res.status(400).json({
                        message: "Error while placing bid",
                      });
                    });
                }
              });
            }
          })
          .catch((err) => {
            res.status(400).json({
              error: err,
            });
          });
      }
    })
    .catch((error) => {
      res.status(401).json({
        error: error,
        message: "User is not found",
      });
    });
  console.log("id", { productId: _id });
};
exports.getMyBid = (req, res) => {
  const myBidDetails = req.bidProduct;
  res.json({
    myBidDetails,
  });
};
exports.getMyAllBidList = (req, res) => {
  const { _id } = req.user;
  Mybid.find({ userId: _id })
    .then((result) => {
      if (result.length) {
        res.json({
          result,
        });
      } else {
        res.json({
          message: "No bid is placed by User",
        });
      }
    })
    .catch(() => {
      res.status(400).send({
        message: "Error in finding User details",
      });
    });
};

exports.updateMyBid = (req, res) => {
  const myBidDetails = req.bidProduct;
  const { _id } = myBidDetails;
  const { my_bid } = req.body;
  Mybid.updateOne({ _id: _id }, { my_bid: my_bid })
    .then(() => {
      res.json({
        message: "Bid id updated",
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};
exports.deleteMyBid = () => {
  const myBidDetails = req.bidProduct;
  myBidDetails
    .deleteOne()
    .then(() => {
      res.json({
        message: "bid is deleted",
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};
