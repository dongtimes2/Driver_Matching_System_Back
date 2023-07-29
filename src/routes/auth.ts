import { Router } from "express";
import authentication from "../middlewares/authentication.js";

const router = Router();

router.post("/signin", authentication, (req, res) => {
  res.json({ accessToken: req.accessTokenData });
});

export default router;
