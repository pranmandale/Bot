import {  messages } from "../controller/chatBot.msg.js";
import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/messages", authenticate, messages);

export default router;
