const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: {
    message: "Too many login attempts, please try again after 1 minute.",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

module.exports = loginLimiter;
