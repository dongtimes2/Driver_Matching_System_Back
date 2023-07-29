import { Router } from "express";
import auth from "./auth.js";
import accounts from "./accounts.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get("/", (req, res) => {
  res.json("server_status_ok");
});

router.use("/auth", auth);
router.use("/accounts", authorization, accounts);

export default router;
