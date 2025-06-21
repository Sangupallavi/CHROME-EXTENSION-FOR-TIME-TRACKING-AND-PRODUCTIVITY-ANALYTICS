// 📁 controllers/authcontroller.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      const conflictField = existingUser.username === username ? "Username" : "Email";
      return res.status(400).json({ error: `${conflictField} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    req.session.userId = user._id;
    res.json({ msg: 'Registered successfully', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.userId = user._id;
    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ msg: 'Logged out successfully' });
  });
};