import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
  return { accessToken, refreshToken };
};

export const setTokenCookies = (res, { accessToken, refreshToken }) => {
  // In development, we'll set these options to make cookies work with frontend
  const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge,
    domain: 'localhost'
  });

  res.cookie('access_token', accessToken, cookieOptions(15 * 60 * 1000)); // 15 minutes
  res.cookie('refresh_token', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days
};

export const clearTokenCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieClearOptions = { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', path: '/' };
  res.cookie('access_token', '', { ...cookieClearOptions, maxAge: 0 });
  res.cookie('refresh_token', '', { ...cookieClearOptions, maxAge: 0 });
};

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    
    if (!token) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    res.json({ message: 'Token refreshed successfully' });
  } catch (err) {
    clearTokenCookies(res);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};