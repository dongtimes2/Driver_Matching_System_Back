import { RequestHandler } from "express";
import { verifyAccessToken } from "../utils/token.js";
import { IError } from "../types/error.js";

const authorization: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      messsage: "access_token이 전달되지 않음",
    });
  }

  const accessToken = authorization.split(" ")[1];

  try {
    const uid = verifyAccessToken(accessToken);
    req.uidData = uid;
  } catch (err) {
    const error = err as IError;
    if (error.message === "expired") {
      return res.status(401).json({
        message: "expired_access_token",
      });
    } else {
      return res.status(401).json({
        messsage: "유효한 access_token이 아님",
      });
    }
  }

  next();
};

export default authorization;
