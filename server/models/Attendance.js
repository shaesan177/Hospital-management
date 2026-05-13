import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, default: Date.now },
  entryTime: { type: String }, // Format: "08:00 AM"
  exitTime: { type: String },  // Format: "04:30 PM"
  natureOfWork: { type: String },
  rest: { type: String },      // e.g., "60 min"
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'], default: 'PRESENT' }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
