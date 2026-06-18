import { Router } from 'express';
import { body } from 'express-validator';
import { firebaseAuth, getMe, loginUser, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

router.post('/firebase', firebaseAuth);

router.get('/me', protect, getMe);

export default router;