import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

// Extend Request to include user property
interface AuthRequest extends Request {
  userId?: string; // you can use more specific type if you decode more info
}
interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;
  console.log(token);

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;
    req.userId = decoded.userId; // attach to request object
    console.log(req.userId, "JWT");

    next(); // pass control to the next middleware
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default verifyJWT;
