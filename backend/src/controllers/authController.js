import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { firebaseAdminAuth } from '../config/firebaseAdmin.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const buildAuthResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
  token: signToken(user._id),
});

export const firebaseAuth = asyncHandler(async (req, res) => {
  if (!firebaseAdminAuth) {
    return res.status(503).json({
      message: 'Firebase Admin is not configured on the backend. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    });
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Firebase token is required' });
  }

  const decoded = await firebaseAdminAuth.verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();

  if (!email) {
    return res.status(400).json({ message: 'Firebase account does not contain an email' });
  }

  let user = await User.findOne({ $or: [{ firebaseUid: decoded.uid }, { email }] });

  if (!user) {
    user = await User.create({
      name: decoded.name || decoded.email.split('@')[0],
      email,
      authProvider: 'firebase',
      firebaseUid: decoded.uid,
    });
  } else {
    user.authProvider = 'firebase';
    user.firebaseUid = decoded.uid;
    if (!user.name && decoded.name) {
      user.name = decoded.name;
    }
    await user.save();
  }

  res.json(buildAuthResponse(user));
});

export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(buildAuthResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.password || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json(buildAuthResponse(user));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});