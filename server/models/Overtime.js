import mongoose from 'mongoose';

const overtimeSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  startTime: { type: String },
  endTime: { type: String },
  task: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Overtime', overtimeSchema);
