const VerifyAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).send({
      success: false,
      message: "Your are not authorized users",
    });
  }
  next();
};

module.exports = VerifyAdmin;
