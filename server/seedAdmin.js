import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      existingAdmin.password = 'admin';
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin user password updated.');
    } else {
      const adminUser = new User({
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin',
        name: 'Admin User'
      });
      await adminUser.save();
      console.log('Admin user created successfully.');
    }

    // Check if manager already exists
    const existingManager = await User.findOne({ email: 'manager@example.com' });
    if (existingManager) {
      console.log('Manager user already exists. Updating password...');
      existingManager.password = 'manager';
      existingManager.role = 'manager';
      await existingManager.save();
      console.log('Manager user password updated.');
    } else {
      const managerUser = new User({
        email: 'manager@example.com',
        password: 'manager',
        role: 'manager',
        name: 'Manager User'
      });
      await managerUser.save();
      console.log('Manager user created successfully.');
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });
