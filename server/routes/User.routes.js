import { registerUser, sendAlerts } from "../controllers/User.controllers.js";

import express from "express";
const router = express.Router();

router.post("/users", registerUser);
  
router.post("/alert", sendAlerts);

export default router;