import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  meta: { type: String },
  type: { type: String, enum: ['LOGIN', 'PERMISSION', 'BACKUP', 'USER_CREATE', 'API_KEY'], default: 'LOGIN' },
  status: { type: String, enum: ['SUCCESS', 'FAILURE', 'WARNING'], default: 'SUCCESS' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
