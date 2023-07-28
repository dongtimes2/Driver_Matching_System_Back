import express, { Application } from "express";
import { PORT } from "./config/secretKey.js";
import loaders from "./loaders/index.js";

const startServer = async () => {
  const app: Application = express();

  await loaders(app);

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer();
