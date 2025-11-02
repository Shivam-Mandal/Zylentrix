import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  signup,
  login,
  refresh,
  logout,
  getMe
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
