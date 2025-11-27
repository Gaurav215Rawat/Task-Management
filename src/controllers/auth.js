const User = require("../models/user");
const { signToken } = require("../utils/jwt");
const redis = require("../config/redis");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await user.isValidPassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const sessionKey = `session:${user.id}`;

    await redis.set(
      sessionKey,
      token,
      "EX",
      Number(process.env.CACHE_TTL || 3600)
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login error" });
  }
};

const logout = async (req, res) => {
  try {
    const sessionKey = `session:${req.user.id}`;
    await redis.del(sessionKey);

    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  register,
  login,
  logout,
};
