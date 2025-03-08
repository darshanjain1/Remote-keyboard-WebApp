import { Router } from "express";
import keyboardRouter from "./keyboard.js";
const router = Router();

router.use("/keyboard", keyboardRouter);

export default router;
