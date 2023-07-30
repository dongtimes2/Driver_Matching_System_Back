import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.get("/", async (req, res, next) => {
  const uid = req.uidData;

  try {
    const userData = await User.findById(uid).lean();
    res.json({
      name: userData?.name,
      type: userData?.type,
    });
  } catch (error) {
    console.error(error);
    return next(new Error());
  }
});

router.patch("/", async (req, res, next) => {
  const { type } = req.body;
  const uid = req.uidData;

  if (type === "driver" || type === "passenger") {
    try {
      await User.findByIdAndUpdate(uid, { type });
    } catch (error) {
      console.error(error);
      next(new Error());
    }
  } else {
    return res.status(400).json({
      message: "올바르지 않은 타입이 전달되었음",
    });
  }
});

export default router;
