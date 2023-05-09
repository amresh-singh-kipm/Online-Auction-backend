const express = require("express");
const path = require("path");
const router = express.Router();
const { check } = require("express-validator");
const { signUp, signIn, signOut } = require("../controllers/auth");
const verifyUser = require("../models/verifyUser");
const User = require("../models/user");
const bcrypt = require("bcrypt");
router.post(
  "/register",
  [
    check("name", "Name should be atleast 3 char").isLength({ min: 1 }),
    check("email", "email is required").isEmail(),
    check("encry_password", "password should be atleast 3 char").isLength({
      min: 3,
    }),
  ],
  signUp
);

router.post(
  "/login",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  signIn
);
router.get("/signout", signOut);

//verify user

router.get("/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;
  verifyUser
    .find({ userId })
    .then((result) => {
      if (result) {
        const { expireAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        if (expireAt.getTime() > Date.now()) {
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    verifyUser
                      .deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname, "../views/userVerification.html")
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          "An error while finalizing successful message";
                        res.redirect(
                          `/api/verified?error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    let message = "An error while updating user record";
                    res.redirect(`/api/verified?error=true&message=${message}`);
                  });
              } else {
                let message = "Invalidation verification details passed";
                res.redirect(`/api/verified?error=true&message=${message}`);
              }
            })
            .catch(() => {
              let message = "An error while comparing unique string";
              res.redirect(`/api/verified?error=true&message=${message}`);
            });
        } else {
          verifyUser
            .deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has been expired";
                  res.redirect(`/api/verified?error=true&message=${message}`);
                })
                .catch(() => {
                  let message =
                    "An error while clearing user with expired unique string";
                  res.redirect(`/api/verified?error=true&message=${message}`);
                });
            })
            .catch(() => {
              let message = "An error while deleting expired user";
              res.redirect(`/api/verified?error=true&message=${message}`);
            });
        }
      } else {
        let message = "An error record does not match";
        res.redirect(`/api/verified?error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message = "An error";
      res.redirect(`/api/verified?error=true&message=${message}`);
    });
});
router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/userVerification.html"));
});
module.exports = router;
