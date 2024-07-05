import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const tokenverify = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // console.log("Authorization header missing or incorrect format");
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];
  //   console.log("Token received:", token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: payload.userId };

    next();
  } catch (err) {
    // console.log("Token verification failed:", err);
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export default tokenverify;
