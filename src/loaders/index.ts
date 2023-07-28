import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db.js";

const loaders = async (app: Application) => {
  await connectDB();
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

export default loaders;
