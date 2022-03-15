const jwt = require('jsonwebtoken');


const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, "secrectkey", (err, user) => {
        if (err) {
          res.status(403).json("token not valid");
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(401).json("you are not authenticated");
    }
  };
  

const generateAccessToken = (user) => {
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      "secrectkey",
      { expiresIn: "15m" }
    );
    return accessToken;
  };
  
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      "refreshSecrectkey"
    );
    return refreshToken;
  };


  module.exports = { generateAccessToken, generateRefreshToken, verify }