import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './models/Role.js';
import AuditLog from './models/AuditLog.js';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

const seedAdminData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing roles and logs
    await Role.deleteMany({});
    await AuditLog.deleteMany({});

    // Seed Roles
    const roles = [
      { name: 'admin', description: 'Full system access, including financial and security configurations.', color: 'bg-red-500' },
      { name: 'manager', description: 'Medical record oversight, prescription authorization, and staff schedules.', color: 'bg-blue-500' },
      { name: 'staff', description: 'Standard access to patient records, diagnostics, and appointments.', color: 'bg-emerald-500' },
      { name: 'billing', description: 'Insurance processing, invoicing, and financial reporting modules.', color: 'bg-orange-500' }
    ];
    await Role.insertMany(roles);
    console.log('Roles seeded successfully');

    // Seed Audit Logs
    const logs = [
      { title: 'Failed Login Attempt', meta: 'Admin-12 Account | IP: 192.168.1.104', type: 'LOGIN', status: 'FAILURE' },
      { title: 'Permission Changed', meta: 'Role "Staff" modified by Dr. Sarah Smith', type: 'PERMISSION', status: 'SUCCESS' },
      { title: 'System Backup Completed', meta: 'Automated Weekly Backup (Encrypted)', type: 'BACKUP', status: 'SUCCESS' },
      { title: 'New User Created', meta: 'Dr. James Wilson (Physician Role)', type: 'USER_CREATE', status: 'SUCCESS' },
      { title: 'API Key Regenerated', meta: 'Legacy billing service integration', type: 'API_KEY', status: 'SUCCESS' }
    ];
    await AuditLog.insertMany(logs);
    console.log('Audit logs seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAdminData();
