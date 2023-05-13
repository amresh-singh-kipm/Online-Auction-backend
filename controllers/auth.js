const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const VerifyUser = require("../models/verifyUser");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();
const smtpTransport = require("nodemailer-smtp-transport");
const express = require("express");
const router = express.Router();

// const transporter = nodemailer.createTransport(
//   smtpTransport({
//     service: "Hotmail",
//     auth: {
//       user: "amresh7309@gmail.com",
//       pass: "Vicky79@",
//     },
//   })
// );

// let testAccount =  nodemailer.createTestAccount();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.AUTH_EMAIL,
//     pass: process.env.AUTH_PASSWORD,
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "clovis.heidenreich97@ethereal.email",
    pass: "hVmfW3Hh8J1jXbw9fb",
  },
});

exports.signUp = (req, res) => {
  const errors = validationResult(req);
  const { name, encry_password, mobile, email } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  //CHECKING USER IS EXIST OR NOT
  User.findOne({ email })
    .then((result) => {
      if (result) {
        res.status(400).json({
          message: "Email is Already Registered",
        });
      } else {
        //HASHING THE PASSWORD
        const saltRounds = 10;
        bcrypt
          .hash(encry_password, saltRounds)
          .then((hashPassword) => {
            const user = new User({
              name,
              email,
              encry_password: hashPassword,
              mobile,
              verified: false,
            });
            //SAVING USER IN DATABASES
            user
              .save()
              .then((result) => {
                let token = jwt.sign(
                  { id: result._id },
                  process.env.SECRET_KEY
                );
                res.cookie("token", token, { expire: new Date() + 1000 });
                sendVerifationEmail(result, res);
                // res.json({
                //   success: true,
                //   message: "user is created",
                //   token,
                // });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          })
          .catch((err) => {
            res.status(400).json({
              status: "FAILED",
              message: "An error while hashing the password",
            });
          });
      }
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
};

const sendVerifationEmail = ({ _id, email }, res) => {
  const url = "http://localhost:5050/";
  const uniqueString = uuidv4() + _id;
  const mailOptions = {
    // console.log("whats error")
    from: "amreshsign000@gmail.com",
    to: email,
    subject: "Verify Your Email",
    html: `<p>Press<a href = ${
      url + "api/verify/" + _id + "/" + uniqueString
    }> </a> TO PROCEED</p>`,
  };
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new VerifyUser({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expireAt: Date.now() + 3000000,
      });
      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then((resp) => {
              res.status(200).json({
                STATUS: "PENDING",
                message: "Verification email is sent",
              });
            })
            .catch((error) => {
              res.status(400).json({
                err: "Verification email failed",
                error,
              });
            });
        })
        .catch((error) => {
          res.status(400).json({
            err: "Could not save verification email data",
            error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        err: "An error occurred while hashing email data",
        error,
      });
    });
  // if (req.url == `${url + "user/verify/" + _id + "/" + uniqueString}`) {
  //   res.end("<h1>Password reset page</h1>");
  // }
};
exports.signIn = (req, res) => {
  const errors = validationResult(req);

  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  //FINDING A USER FROM DATABASES

  User.findOne({ email })
    .then((result) => {
      const { encry_password ,verified} = result;
      const hashedPassword = encry_password;
      let token = jwt.sign({ id: result._id }, process.env.SECRET_KEY, {
        expiresIn: "300s",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      if(verified){
        bcrypt
          .compare(password, hashedPassword)
          // console.log("password",password,hashedPassword)
          .then((user) => {
            if (user) {
              return res.status(200).json({
                token,
                user: result,
                success: true,
              });
            } else {
              res.status(400).json({
                error: "Invalid Email OR Password",
              });
            }
          })
          .catch((err) => {
            res.status(400).json({
              error: "Error while comparing password",
            });
          });
      }
      else{
        res.status(401).json({
          error: "User is not verified ",
        })
      }
    })
    .catch((err, users) => {
      if (err || !users) {
        console.log(" error", err);
        return res.status(406).json({
          err: "NOT ABLE TO FIND USER IN DATABASE",
        });
      }
    });
};

//FUNCTION FOR SIGNOUT

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "SIGNOUT IS SUCCESS",
  });
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["RS256", "sha1", "HS256"],
  userProperty: "auth",
});

// Custom Middlewares
// exports.isAuthenticated = (req, res, next) => {
//   let checker = req.profile && req.auth && req.profile._id == req.auth._id;
//   if (!checker) {
//     return res.status(403).json({
//       err: "ACCESS DENIED",
//     });
//   }
//   next();
// };
