import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

const router = express.Router();

const calculateHours = (startMs, endMs) => {
  if (!startMs || !endMs) return 0;
  let diff = (new Date(endMs) - new Date(startMs)) / (1000 * 60 * 60);
  return diff > 0 ? diff : 0;
};

// Overtime is any Net Worked hours exceeding standard 10-hour shift.
const calculateOT = (netHours) => {
  return netHours > 10 ? netHours - 10 : 0;
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
        checkOut: record ? record.checkOut : null,
        totalHours: record ? record.totalHours : 0,
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

// Get attendance history for a specific employee
router.get('/history/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await Attendance.find({ employee: employeeId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update attendance (Manual Entry)
router.post('/', async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, natureOfWork } = req.body;
    
    // Calculations
    const totalHours = calculateHours(checkIn, checkOut);
    const otHours = calculateOT(totalHours);

    // Completion Status logic
    let completionStatus = 'Pending';
    if (status === 'PRESENT') {
      if (checkIn && checkOut) {
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
        checkOut: checkOut ? new Date(checkOut) : null, 
        totalHours, otHours,
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
