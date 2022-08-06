const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
  const payload = {
    user: userId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
};

module.exports = generateToken;
