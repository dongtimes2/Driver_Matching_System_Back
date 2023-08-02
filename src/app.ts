import express, { Application } from "express";
import { PORT } from "./config/secretKey.js";
import loaders from "./loaders/index.js";
import router from "./routes/router.js";
import createHttpError from "http-errors";
import errorHandler from "./middlewares/errorHandler.js";
import http from "http";

import socketModule from "./loaders/socket.js";

const startServer = async () => {
  const app: Application = express();
  const httpServer = http.createServer(app);

  await loaders(app);
  await socketModule(httpServer);
  app.use(router);
  app.use((req, res, next) => {
    next(createHttpError(404));
  });
  app.use(errorHandler);

  httpServer.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer();
