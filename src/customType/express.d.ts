import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      accessTokenData: string;
    }
  }
}
