import express from 'express';
import { fetchProfile, login, refreshToken, register, logout } from '../controller/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';


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

router.get('/profile', authenticate, fetchProfile);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);

export default router;