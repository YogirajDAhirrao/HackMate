export const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";
export const JWT_EXPIRES_IN = "7d";
export const COOKIE_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
