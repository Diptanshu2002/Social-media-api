const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// /api/auth/

// REGISTER USER ROUTE ---------------------------------------------------------------------------------------------------------------------
router.post("/register", async (req, res) => {
  const plainTextPassword = req.body.password;

  try {
    //generating salt
    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(plainTextPassword, salt);

    //saving user in the data base
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: encryptPassword,
    });
    console.log("user :", user);
    res.status(200).json({
      status: "ok",
      message: "date saved in database",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "error",
      error: "data failed to saved in database",
    });
  }
});

// LOGIN USER ROUTE ---------------------------------------------------------------------------------------------------------------------

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const matchPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (matchPassword) {
        res.status(200).json({
          status: "ok",
          message: "password matched",
        });
      } else {
        res.status(404).json({
          status: "error",
          error: "password incorrect",
        });
      }
    } else {
      res.status(404).json({
        status: "error",
        error: "user doesnot exist",
      });
    }
  } catch (err) {
    console.log(err);
    req.status(404).json({
      status: 404,
      error: "unwanted error",
    });
  }
});

module.exports = router;
