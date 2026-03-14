import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

/* -------- User Authentication -------- */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token must start with 'Bearer '.",
      });
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is invalid or expired.",
      });
    }

    const user = await userModel.findById(payload.id).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(
      "User Authentication Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during authentication.",
      error: `User Authentication Error: ${error?.stack || error?.message || error}`,
    });
  }
}
