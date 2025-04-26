import dotenv from "dotenv";

dotenv.config();

export const isDev = process.env.NODE_ENV !== "production";
export const backendURL = isDev ? "http://localhost:8800" : process.env.BACKEND_URL;
export const frontendURL = isDev ? "http://localhost:3000" : process.env.FRONTEND_URL;
export const cookieDomain = isDev ? "" : ".vercel.app";