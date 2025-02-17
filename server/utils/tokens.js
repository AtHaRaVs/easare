const { v4: uuidv4 } = require("uuid");

const tokens = new Map();

const generateToken = () => {
  const token = uuidv4();
  tokens.set(token, Date.now() + 5 * 60 * 1000);
  console.log("generating token", token);
  return token;
};

const validateToken = (req, res, next) => {
  const token = req.headers["x-upload-token"];

  if (!token || !tokens.has(token)) {
    return res.status(403).json({ error: "invalid missing token" });
  }

  if (tokens.get(token) < Date.now()) {
    tokens.delete(token);
    return res.status(403).json({ error: "Token expired" });
  }

  console.log("verifying token");
  tokens.delete(token);
  next();
};

module.exports = { generateToken, validateToken };
