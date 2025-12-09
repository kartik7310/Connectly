import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const generateToken = (id, expiresIn = "7d") => {
  return jwt.sign({id}, config.jwtSecret, {
    expiresIn,
  });
};

