import jwt from "jsonwebtoken";
import { CONFIG } from "src/config/configuration";

export const generateAccessToken = (data: any) => {
  return jwt.sign(data, CONFIG.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
};

export const generateRefreshToken = (data: any) => {
  return jwt.sign(data, CONFIG.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
