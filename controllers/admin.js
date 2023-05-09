const User = require("../models/user");
const bcrypt = require("bcrypt");
exports.getUserById = (req, res, next, _id) => {
  console.log("userID", { _id });
  User.findOne({ _id })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(() => {
      res.status(400).json({
        message: "User is not found",
      });
    });
};
exports.getUser = (req, res) => {
  User.find().then((result) => {
    res.json({
      success: true,
      result,
    });
  });
};

exports.deleteUser = (req, res) => {
  const user = req.user;
  user
    .deleteOne()
    .then((user) => {
      res.json({
        user,
        message: "User is Deleted",
      });
    })
    .catch(() => {
      res.status(400).json({
        message: "User is not Deleted",
      });
    });
};

exports.updateUser = (req, res) => {
  const user = req.user;
  const saltRounds = 10;
  const { name, mobile, encry_password, email } = req.body;
  bcrypt
    .hash(encry_password, saltRounds)
    .then((hashedPassword) => {
      (user.name = name),
        (user.email = email),
        (user.mobile = mobile),
        (user.encry_password = hashedPassword)
          .save()
          .then((user) => {
            res.json({
              user,
            });
          })
          .catch((err) => {
            res.json({
              error: err,
              message: "Error while updating user record",
            });
          });
    })
    .catch((err) => {
      res.json({
        error: err,
        message: "Error while hashing Password",
      });
    });
};
