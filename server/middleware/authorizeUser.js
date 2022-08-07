const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizeUser = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return res.status(403).json("Unauthorized");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(403).json("Unauthorized");
  }
};

module.exports = authorizeUser;
