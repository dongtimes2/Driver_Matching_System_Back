import jwt, { JwtPayload } from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "../config/secretKey.js";
import User from "../models/User.js";

interface IDecodedToken extends JwtPayload {
  uid: string;
}

export const getAccessToken = (uid: string) => {
  const accessToken = jwt.sign({ uid }, TOKEN_SECRET_KEY, {
    expiresIn: "3600s",
  });

  return accessToken;
};

export const getRefreshToken = async (uid: string) => {
  const refreshTokenData = jwt.sign({}, TOKEN_SECRET_KEY, {
    expiresIn: "14d",
  });

  await User.findByIdAndUpdate(uid, { refreshToken: refreshTokenData });

  return refreshTokenData;
};

export const verifyAccessToken = (accessToken: string) => {
  let result = "";

  jwt.verify(accessToken, TOKEN_SECRET_KEY, (error, decoded) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        throw Error("expired");
      } else {
        throw Error();
      }
    } else {
      result = (decoded as IDecodedToken).uid;
    }
  });

  return result;
};

// 토큰의 유효성은 검사하지 않고, 그저 decode만 수행한다.
export const decodeAccessToken = (accessToken: string) => {
  const { uid } = jwt.decode(accessToken) as IDecodedToken;

  return uid;
};

export const verifyRefreshToken = async (uid: string, refreshToken: string) => {
  jwt.verify(refreshToken, TOKEN_SECRET_KEY, (error) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        throw Error("refresh_expired");
      } else {
        throw Error();
      }
    }
  });

  try {
    const result = await User.findById(uid).lean();

    if (result?.refreshToken === refreshToken) {
      return;
    }
  } catch (error) {
    console.error(error);
    throw Error();
  }
};
