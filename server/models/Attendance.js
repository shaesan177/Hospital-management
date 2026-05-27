import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  totalHours: { type: Number, default: 0 },
  otHours: { type: Number, default: 0 },
  natureOfWork: { type: String },
  status: { type: String, enum: ['PRESENT', 'ABSENT'], default: 'PRESENT' },
  completionStatus: { type: String, enum: ['Completed', 'Incomplete', 'Pending'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
