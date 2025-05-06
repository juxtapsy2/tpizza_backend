import dotenv from "dotenv";

dotenv.config();

export const isDev = process.env.NODE_ENV !== "production";
export const backendURL = isDev ? "http://localhost:8800" : process.env.BACKEND_URL;
export const frontendURL = isDev ? "http://localhost:3000" : process.env.FRONTEND_URL;
export const cookieDomain = isDev ? "" : ".vercel.app";

export const PIZZA_PRICES = {
    "7-Thin": 99000,
    "7-Regular": 109000,
    "7-Thick": 129000,
    "9-Thin": 149000,
    "9-Regular": 159000,
    "9-Thick": 169000,
    "12-Thin": 229000,
    "12-Regular": 249000,
    "12-Thick": 269000,
};