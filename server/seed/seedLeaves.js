import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Leave from '../models/Leave.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

const holidays = [
  { leaveDate: new Date('2026-01-26'), reason: 'Republic Day', leaveDays: 1 },
  { leaveDate: new Date('2026-01-14'), reason: 'Pongal', leaveDays: 1 },
  { leaveDate: new Date('2026-08-15'), reason: 'Independence Day', leaveDays: 1 },
  { leaveDate: new Date('2026-10-02'), reason: 'Gandhi Jayanthi', leaveDays: 1 },
  { leaveDate: new Date('2026-11-08'), reason: 'Diwali', leaveDays: 1 },
  { leaveDate: new Date('2026-12-25'), reason: 'Christmas', leaveDays: 1 },
  { leaveDate: new Date('2027-01-01'), reason: 'New Year', leaveDays: 1 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing leaves of type "Government Holiday"
    await Leave.deleteMany({ type: 'Government Holiday' });
    
    await Leave.insertMany(holidays);
    console.log('Holidays seeded successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
