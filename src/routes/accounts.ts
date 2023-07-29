import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.get("/", async (req, res, next) => {
  const uid = req.uidData;

  try {
    const userData = await User.findById(uid);
    res.json({
      name: userData?.name,
      type: userData?.type,
    });
  } catch (error) {
    console.error(error);
    return next(new Error());
  }
});

export default router;
