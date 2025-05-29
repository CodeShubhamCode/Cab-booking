const captainModel = require("../models/captain.model");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const captain = await captainModel.findById(decoded._id);

    req.captain = captain;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};
