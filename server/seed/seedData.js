import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Holiday from '../models/Holiday.js';
import Overtime from '../models/Overtime.js';

dotenv.config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Holiday.deleteMany({});
    await Overtime.deleteMany({});

    // Create Admin User
    const admin = new User({
      name: 'Admin User',
      email: 'admin@hmsportal.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');

    // Create Employees
    const employeesData = [
      {
        name: 'Dr. Alistair Vance',
        email: 'vance@hmsportal.com',
        registerId: 'HMS-REG-9902',
        department: 'OT ASSISTANT',
        designation: 'Senior Consultant',
        status: 'ON-DUTY',
        fatherName: 'Robert Vance',
        sex: 'Male',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alistair'
      },
      {
        name: 'Kumaran',
        email: 'kumaran@hmsportal.com',
        registerId: 'WL-4921',
        department: 'LAB TECHNICIAN',
        designation: 'Technician',
        status: 'ON-DUTY',
        fatherName: 'Suresh Kumar',
        sex: 'Male',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kumaran'
      },
      {
        name: 'Chithrakala',
        email: 'chithrakala@hmsportal.com',
        registerId: 'WL-5012',
        department: 'WARD ASSISTANT',
        designation: 'Ward Assistant',
        status: 'ON-DUTY',
        fatherName: 'Kamaraj',
        sex: 'Female',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chithrakala'
      },
      {
        name: 'Hari',
        email: 'hari@hmsportal.com',
        registerId: 'WL-3812',
        department: 'ADMIN',
        designation: 'Security Officer',
        status: 'OFF-DUTY',
        fatherName: 'Dev Sharma',
        sex: 'Male',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hari'
      },
      {
        name: 'Shruthi',
        email: 'shruthi@hmsportal.com',
        registerId: 'WL-9201',
        department: 'SWEEPER',
        designation: 'Cleaner',
        status: 'ON-DUTY',
        fatherName: 'Radha Krishnan',
        sex: 'Female',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shruthi'
      }
    ];

    const employees = await Employee.insertMany(employeesData);
    console.log(`${employees.length} employees created`);

    // Create Attendance Records
    const attendanceRecords = employees.map(emp => ({
      employee: emp._id,
      date: new Date(),
      entryTime: emp.status === 'ON-DUTY' ? '08:00 AM' : '-',
      exitTime: emp.status === 'ON-DUTY' ? '04:30 PM' : '-',
      natureOfWork: emp.designation,
      rest: '45 min',
      status: emp.status === 'ON-DUTY' ? 'PRESENT' : 'ABSENT'
    }));

    await Attendance.insertMany(attendanceRecords);
    console.log('Attendance records created');

    // Create some sample Overtime
    const overtimeRecords = [
      {
        employee: employees[0]._id,
        date: new Date(),
        hours: 4,
        task: 'Emergency Surgery Support',
        status: 'Approved'
      },
      {
        employee: employees[1]._id,
        date: new Date(),
        hours: 2,
        task: 'Equipment Maintenance',
        status: 'Pending'
      }
    ];
    await Overtime.insertMany(overtimeRecords);
    console.log('Overtime records created');

    // Create some sample Holiday requests
    const holidayRecords = [
      {
        employee: employees[3]._id,
        type: 'Annual',
        startDate: new Date(2023, 10, 1),
        endDate: new Date(2023, 10, 5),
        reason: 'Family Trip',
        status: 'Approved'
      }
    ];
    await Holiday.insertMany(holidayRecords);
    console.log('Holiday records created');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
