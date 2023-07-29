import { Router } from "express";
import auth from "./auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json("server_status_ok");
});

router.use("/auth", auth);

export default router;
