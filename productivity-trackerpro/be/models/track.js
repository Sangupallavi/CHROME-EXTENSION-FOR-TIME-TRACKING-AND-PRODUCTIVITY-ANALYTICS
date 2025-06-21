// 📁 models/Track.js
import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  url: String,
  timeSpent: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Track', trackSchema);