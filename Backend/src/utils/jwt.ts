import jwt from "jsonwebtoken";
import { Response } from "express";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  COOKIE_EXPIRES_IN,
  IS_PRODUCTION,
} from "../config/config.js";

export interface JwtPayloadWithUserId {
  userId: string;
}

export const signToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const sendTokenCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    expires: new Date(Date.now() + COOKIE_EXPIRES_IN),
  });
};

export const verifyToken = (token: string): JwtPayloadWithUserId => {
  return jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;
};
