import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  leaveDate: { type: Date, required: true },
  reason: { type: String, required: true },
  leaveDays: { type: Number, required: true },
  type: { type: String, default: 'Government Holiday' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Leave', leaveSchema);
