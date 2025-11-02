import User from '../models/User.js';
import {
  generateTokens,
  setTokenCookies,
  clearTokenCookies,
  refreshToken
} from '../middlewares/auth.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Registration successful'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Login successful'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = refreshToken;

export const logout = (req, res) => {
  clearTokenCookies(res);
  res.json({ message: 'Logged out successfully' });
};

export const getMe = (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
};
