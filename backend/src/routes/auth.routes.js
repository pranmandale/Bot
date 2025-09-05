import express from 'express';
import { login, register } from '../controller/auth.controller.js';


const router = express.Router();


// Register route
router.post('/register', register);
// Login route
router.post('/login', login);  

// logout route
router.get('/logout', (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict"
  });
  return res.status(200).json({ message: "Logout successful" });
}); 

export default router;