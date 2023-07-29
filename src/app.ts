import express, { Application } from "express";
import { PORT } from "./config/secretKey.js";
import loaders from "./loaders/index.js";
import router from "./routes/router.js";
import createHttpError from "http-errors";
import errorHandler from "./middlewares/errorHandler.js";

const startServer = async () => {
  const app: Application = express();

  await loaders(app);

  app.use(router);

  app.use((req, res, next) => {
    next(createHttpError(404));
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer();
