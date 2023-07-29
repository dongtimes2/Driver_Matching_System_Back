import { admin } from "../loaders/firebase.js";
import { RequestHandler } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "../config/secretKey.js";

const authentication: RequestHandler = async (req, res, next) => {
  const { authentication } = req.headers;

  // firebase의 idToken 검증부분
  if (
    !authentication ||
    !(
      typeof authentication === "string" && authentication.startsWith("Bearer ")
    )
  ) {
    return res.status(401).json({
      message: "id_token이 전달되지 않음",
    });
  }

  const idToken = authentication.split(" ")[1];
  let decodedTokenData: DecodedIdToken;

  try {
    decodedTokenData = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "유효하지 않은 id_token",
    });
  }

  // 유저의 가입여부를 확인하는 부분
  const { uid, name } = decodedTokenData;
  if (!uid || !name) {
    return res.status(400).json({
      message: "등록할 수 없는 계정",
    });
  }

  try {
    const userData = await User.findById(uid);
    if (!userData) {
      const user = new User({
        _id: uid,
        name,
      });
      await user.save();
    }
  } catch (error) {
    console.error(error);
    return next(new Error());
  }

  // access token 발급
  const accessToken = jwt.sign({ uid }, TOKEN_SECRET_KEY, {
    expiresIn: "3600s",
  });

  req.accessTokenData = accessToken;
  next();
};

export default authentication;
