import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: 'bg-slate-500' },
  permissions: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
