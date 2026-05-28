import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalWorkingDays: { type: Number, default: 0 },
  totalWorkedHours: { type: Number, default: 0 },
  totalOTHours: { type: Number, default: 0 },
  totalOTAmount: { type: Number, default: 0 },
  totalDeductionHours: { type: Number, default: 0 },
  totalDeductionAmount: { type: Number, default: 0 },
  baseSalary: { type: Number, default: 0 },
  finalSalary: { type: Number, default: 0 },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'PAID'], default: 'PENDING' }
}, { timestamps: true });

payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Payroll', payrollSchema);
