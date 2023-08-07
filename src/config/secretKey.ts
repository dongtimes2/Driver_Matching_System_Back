import "dotenv/config";
export const MONGO_DB_URL = process.env.MONGO_DB_URL as string;
export const PORT = process.env.PORT;
export const SERVICE_SECRET_KEY = JSON.parse(
  process.env.SERVICE_SECRET_KEY as string
);
export const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY as string;
export const FRONT_URL = process.env.FRONT_URL;
