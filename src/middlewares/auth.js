const { verifyToken } = require("../utils/jwt");
const redis = require("../config/redis");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const payload = verifyToken(token);

    // Check session in redis
    const sessionKey = `session:${payload.id}`;
    const session = await redis.get(sessionKey);

    if (!session) {
      return res
        .status(401)
        .json({ message: "Session not found or logged out" });
    }

    req.user = payload;
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
