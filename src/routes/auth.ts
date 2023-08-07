import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import {
  decodeAccessToken,
  getAccessToken,
  verifyRefreshToken,
} from "../utils/token.js";
import User from "../models/User.js";

const router = Router();

router.post("/signin", authentication, (req, res) => {
  res.cookie("refreshToken", req.refreshTokenData, { httpOnly: true });
  res.json({
    accessToken: req.accessTokenData,
  });
});

router.post("/refresh", async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "access_token이 전달되지 않음",
    });
  }

  const accessToken = authorization.split(" ")[1];
  const { refreshToken } = req.cookies;
  const uid = decodeAccessToken(accessToken);
  const newAccessToken = getAccessToken(uid);

  await verifyRefreshToken(uid, refreshToken);
  res.json({
    accessToken: newAccessToken,
  });
});

router.post("/signout", async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "access_token이 전달되지 않음",
    });
  }

  const accessToken = authorization.split(" ")[1];
  const uid = decodeAccessToken(accessToken);

  await User.findByIdAndUpdate(uid, { refreshToken: "" });
  res.clearCookie("refreshToken");
  res.json({
    message: "signout_OK",
  });
});

export default router;
