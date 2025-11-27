const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "60s";

const signToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  signToken,
  verifyToken
};
