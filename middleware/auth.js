const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    return res
      .status(401)
      .json({ err: "You need to send token to this endpoint/url" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = decodedToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(502).json({ err: "Token invalid or expired" });
  }
};
exports.adminAuth = async (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    return res
      .status(401)
      .json({ err: "You need to send token to this endpoint/url" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (decodedToken.role != "admin") {
      return res
        .status(401)
        .json({ err: "You must be admin to see this endpoint / url" });
    }
    req.tokenData = decodedToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(502).json({ err: "Token invalid or expired" });
  }
};
