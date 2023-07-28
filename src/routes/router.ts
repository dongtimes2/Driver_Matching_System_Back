import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json("server_status_ok");
});

export default router;
