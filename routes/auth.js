const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const {generateAccessToken, generateRefreshToken, verify} = require('../JWT/jwt')
const jwt = require('jsonwebtoken');

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

    res.status(200).json({
      status: "successful",
      message: "user created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "error",
      message: "user not created",
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
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const newUser = {...user._doc, accessToken, refreshToken};
        await user.updateOne({
          refreshToken,
        })
        res.status(200).json({
          status : "successfull",
          ...newUser
        });
      } else {
        res.status(403).json({
          status: "error",
          message: "password is incorrect",
        });
      }
    } else {
      res.status(404).json({
        status: "error",
        message: "email is incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
});


// LOGOUT USER ROUTE ---------------------------------------------------------------------------------------------------------------------

router.get('/logout',verify, async (req, res)=>{
  const id = req.user.id
  try {
    const user = await User.findById(id);
    await user.updateOne({
      refreshToken: ""
    })
    //send blank user to front-end
    res.status(200).json({});
  } catch (error) {
    res.status(404).json({
      status:404,
      message:"Can't able to log out"
    })
  }
})


// REFRESH USER TOKEN ---------------------------------------------------------------------------------------------------------------------

router.post("/refresh", async(req, res) => {

  //take refresh token from user through body
  const refreshToken = req.body.token;

  //sent error no token || token not valid
  if (!refreshToken) {
    return res.status(401).json({
      status: "error",
      message:"you are not authenticated"});
  }   
    try {
      const userDB = await User.findOne({refreshToken})
      if (!userDB) {
            return res.status(403).json({
              status :"error",
              message :"refresh token not valid"});
          }else{
              jwt.verify(refreshToken, "refreshSecrectkey", async(err, user) => {
              if(err){
                res.status(500).json({
                  status :"error",
                  message :"refresh token not valid"})
              }
              //generating new access token
              const newAccessToken = generateAccessToken(userDB);
              const newRefreshToken = generateRefreshToken(userDB);
              
              //updating the refresh token of the user
              await userDB.updateOne({
                refreshToken : newRefreshToken
              })

              //sending new access token and refresh token
              const newUser = {...userDB._doc, accessToken : newAccessToken, refreshToken : newRefreshToken};
              res.status(200).json(newUser);
            });
        }
    } catch (error) {
      res.status(500).json({
        status:"error",
        message:"Internal server error"
      });
    }
});

module.exports = router;
