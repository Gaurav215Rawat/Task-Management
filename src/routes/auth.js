const express = require("express");
const authController = require("../controllers/auth");
const auth = require("../middlewares/auth");

const router = express.Router();

const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../utils/validations");

const loginLimiter = require("../middlewares/rateLimiter");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.post("/logout", auth, authController.logout);



module.exports = router;