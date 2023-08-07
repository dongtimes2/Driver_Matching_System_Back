import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import { FRONT_URL } from "../config/secretKey.js";

const loaders = async (app: Application) => {
  await connectDB();
  app.use(
    cors({
      origin: FRONT_URL,
      credentials: true,
    })
  );
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

export default loaders;
