import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Get attendance for all employees by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const searchDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    // Get all employees
    const employees = await Employee.find();
    
    // Get attendance records for this date
    const attendanceRecords = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Merge employees with their attendance records
    const result = employees.map(emp => {
      const record = attendanceRecords.find(r => r.employee.toString() === emp._id.toString());
      return {
        employee: emp,
        status: record ? record.status : 'ABSENT',
        entryTime: record ? record.entryTime : '—',
        exitTime: record ? record.exitTime : '—',
        natureOfWork: record ? record.natureOfWork : emp.designation,
        rest: record ? record.rest : '—',
        _id: record ? record._id : null
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update attendance (Manual Entry)
router.post('/', async (req, res) => {
  try {
    const { employeeId, date, status, entryTime, exitTime, natureOfWork, rest } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: new Date(date).setHours(0,0,0,0) },
      { status, entryTime, exitTime, natureOfWork, rest },
      { upsert: true, new: true }
    );
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
