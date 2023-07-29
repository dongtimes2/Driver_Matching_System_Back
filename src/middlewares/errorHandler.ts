import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: err.message ? err.message : "internal server error" });
};

export default errorHandler;
