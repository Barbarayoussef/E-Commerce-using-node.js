import jwt from "jsonwebtoken";
import env from "../../config/env.service.js";
export const auth = (req, res, next) => {
  let { authorization } = req.headers;
  console.log(authorization, "hii");

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized from headers" });
  }
  try {
    let [bearer, token] = authorization.split(" ");
    let signature = "";
    switch (bearer) {
      case "admin":
        signature = env.adminSignature;
        break;
      case "user":
        signature = env.userSignature;
        break;
      case "staff":
        signature = env.staffSignature;
        break;

      default:
        return res.status(401).json({ message: "Unauthorized from default" });
    }
    let decoded = jwt.verify(token, signature);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized from error" });
  }
};

export const generateVerifyToken = (user) => {
  let signature = "";
  switch (user.role) {
    case "admin":
      signature = env.adminSignature;
      break;
    case "user":
      signature = env.userSignature;
      break;
    case "staff":
      signature = env.staffSignature;
      break;
    default:
      return res.status(401).json({ message: "Unauthorized" });
  }
  let token = jwt.sign({ id: user._id, role: user.role }, signature, {
    expiresIn: "24h",
  });
  return { token };
};
export const generateBothToken = (user) => {
  let signature = "";
  switch (user.role) {
    case "admin":
      signature = env.adminSignature;
      break;
    case "user":
      signature = env.userSignature;
      break;
    case "staff":
      signature = env.staffSignature;
      break;
  }
  console.log(user._id);

  let accessToken = jwt.sign({ id: user._id, role: user.role }, signature, {
    expiresIn: "24h",
  });
  console.log(accessToken);

  let refreshToken = jwt.sign({ id: user._id, role: user.role }, signature, {
    expiresIn: "1d",
  });
  let token = { accessToken, refreshToken };
  return token;
};
