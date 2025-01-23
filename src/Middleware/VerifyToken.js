const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const VerifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ messgae: "Invalid token" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error("Error while veryfying token", error);
    res.status(401).send({ message: "Error while veryfying token" });
  }
};

module.exports = VerifyToken;
