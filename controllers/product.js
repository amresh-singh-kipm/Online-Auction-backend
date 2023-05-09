const Product = require("../models/product");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Bidder = require("../models/bidder");

// exports.getUserById = (req, res, next, _id) => {
//   User.findOne({ _id })
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       res.status(400).json({
//         error: err,
//         message: "User is not found",
//       });
//     });
// };

exports.getProductById = (req, res, next, _id) => {
  Product.findOne({ _id })
    .then((product) => {
      req.product = product;
      next();
    })
    .catch(() => {
      res.status(400).send({
        message: "Product not found",
      });
    });
};

exports.createProduct = (req, res) => {
  const userId = req.user._id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array[0].msg,
    });
  }
  const { name, description, price, image, location } = req.body;
  const product = new Product({
    name: name,
    description: description,
    price: price,
    image: image,
    location: location,
    expireBid: Date.now() + 10800000,
  });
  product
    .save()
    .then((result) => {
      if (result) {
        const { _id } = product;
        const bidder = new Bidder({
          sellerId: userId,
          productId: _id,
          bidderList: [],
        });
        bidder.save();
        res.status(200).json({
          success: true,
          message: "Product is created successfully",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        err: err.message,
      });
    });
};

exports.getAllProduct = (req, res) => {
  Product.find()
    .then((products) => {
      res.json({
        products,
      });
    })
    .catch((err) => {
      res.json({
        error: err.message,
      });
    });
};
exports.getProduct = (req, res) => {
  const product = req.product;
  return res.json({
    product,
  });
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product
    .deleteOne()
    .then(() => {
      res.json({
        message: "Product is deleted",
      });
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
};

exports.updateProduct = (req, res) => {
  const product = req.product;
  const { name, description, location, price, image } = req.body;
  (product.name = name),
    (product.description = description),
    (product.location = location),
    (product.price = price),
    (product.image = image);
  product
    .save()
    .then((result) => {
      res.json({
        result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.message,
      });
    });
};
