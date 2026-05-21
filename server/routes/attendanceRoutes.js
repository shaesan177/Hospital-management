import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

const router = express.Router();

const calculateHours = (startMs, endMs) => {
  if (!startMs || !endMs) return 0;
  let diff = (new Date(endMs) - new Date(startMs)) / (1000 * 60 * 60);
  return diff > 0 ? diff : 0;
};

// Overtime is any Net Worked hours exceeding standard 8-hour shift.
const calculateOT = (netHours) => {
  return netHours > 8 ? netHours - 8 : 0;
};

// Get attendance for all employees by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const searchDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    const employees = await Employee.find();
    const attendanceRecords = await Attendance.find({
      $or: [
        { date: { $gte: startOfDay, $lte: endOfDay } },
        { 
          checkIn: { $lt: endOfDay },
          checkOut: { $gt: startOfDay }
        }
      ]
    });

    const result = employees.map(emp => {
      const record = attendanceRecords.find(r => r.employee.toString() === emp._id.toString());
      return {
        employee: emp,
        status: record ? record.status : 'ABSENT',
        checkIn: record ? record.checkIn : null,
        breakStart: record ? record.breakStart : null,
        breakEnd: record ? record.breakEnd : null,
        checkOut: record ? record.checkOut : null,
        totalHours: record ? record.totalHours : 0,
        breakDuration: record ? record.breakDuration : 0,
        netHours: record ? record.netHours : 0,
        otHours: record ? record.otHours : 0,
        natureOfWork: record ? record.natureOfWork : emp.designation,
        completionStatus: record ? record.completionStatus : 'Pending',
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
    const { employeeId, date, status, checkIn, breakStart, breakEnd, checkOut, natureOfWork } = req.body;
    
    // Calculations
    const totalHours = calculateHours(checkIn, checkOut);
    const breakDuration = calculateHours(breakStart, breakEnd);
    const netHours = Math.max(0, totalHours - breakDuration);
    const otHours = calculateOT(netHours);

    // Completion Status logic
    let completionStatus = 'Pending';
    if (status === 'PRESENT') {
      if (checkIn && checkOut && breakStart && breakEnd) {
        completionStatus = 'Completed';
      } else {
        completionStatus = 'Incomplete';
      }
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: new Date(date).setHours(0,0,0,0) },
      { 
        status, 
        checkIn: checkIn ? new Date(checkIn) : null, 
        breakStart: breakStart ? new Date(breakStart) : null, 
        breakEnd: breakEnd ? new Date(breakEnd) : null, 
        checkOut: checkOut ? new Date(checkOut) : null, 
        totalHours, breakDuration, netHours, otHours,
        natureOfWork, completionStatus
      },
      { upsert: true, new: true }
    );
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
