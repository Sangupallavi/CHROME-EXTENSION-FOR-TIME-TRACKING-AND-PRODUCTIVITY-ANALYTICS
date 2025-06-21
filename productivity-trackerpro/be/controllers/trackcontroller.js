// 📁 controllers/trackcontroller.js
import Track from '../models/track.js';
import mongoose from 'mongoose';

export const trackTime = async (req, res) => {
  const userId = req.session.userId;
  const { url, timeSpent } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized: Please login' });
  if (!url || !timeSpent) return res.status(400).json({ error: 'Missing url or timeSpent' });

  try {
    const track = new Track({ userId, url, timeSpent });
    await track.save();
    res.json({ msg: 'Time tracked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to track time' });
  }
};

export const getSummary = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) return res.status(400).json({ error: 'Missing userId in query' });

  try {
    const data = await Track.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$url", totalTime: { $sum: "$timeSpent" } } }
    ]);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};