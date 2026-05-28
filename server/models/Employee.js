import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registerId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  status: { type: String, enum: ['ON-DUTY', 'OFF-DUTY', 'ON-LEAVE'], default: 'ON-DUTY' },
  fatherName: { type: String },
  sex: { type: String, enum: ['Male', 'Female', 'Other'] },
  avatar: { type: String },
  basicSalary: { type: Number, default: 0 },
  workingHoursPerDay: { type: Number, default: 10 },
  otRatePerHour: { type: Number, default: 0 },
  deductionRatePerHour: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
