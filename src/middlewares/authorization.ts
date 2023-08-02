import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "../config/secretKey.js";

interface IDecodedToken extends JwtPayload {
  uid: string;
}

const authorization: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      messsage: "access_token이 전달되지 않음",
    });
  }

  const accessToken = authorization.split(" ")[1];

  try {
    const { uid } = jwt.verify(accessToken, TOKEN_SECRET_KEY) as IDecodedToken;
    req.uidData = uid;
  } catch (error) {
    return res.status(401).json({
      messsage: "유효한 access_token이 아님",
    });
  }

  next();
};

export default authorization;
