import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Helper to convert "HH:mm AM/PM" to decimal hours
const timeToDecimal = (timeStr) => {
  if (!timeStr || timeStr === '—' || timeStr === 'Pending') return null;
  const parts = timeStr.split(' ');
  if (parts.length !== 2) return null;
  const [time, modifier] = parts;
  let [hours, minutes] = time.split(':').map(Number);
  if (hours === 12) hours = 0;
  if (modifier === 'PM') hours += 12;
  return hours + (minutes / 60);
};

const calculateHours = (start, end) => {
  const startDec = timeToDecimal(start);
  const endDec = timeToDecimal(end);
  if (startDec === null || endDec === null) return 0;
  let diff = endDec - startDec;
  if (diff < 0) diff += 24; // Handle cross-midnight shifts
  return diff;
};

const calculateOT = (start, end) => {
  const startDec = timeToDecimal(start);
  const endDec = timeToDecimal(end);
  if (startDec === null || endDec === null) return 0;

  const standardStart = 8; // 8:00 AM
  const standardEnd = 20;  // 8:00 PM

  if (endDec >= startDec) {
    const total = endDec - startDec;
    const overlapStart = Math.max(startDec, standardStart);
    const overlapEnd = Math.min(endDec, standardEnd);
    const overlap = Math.max(0, overlapEnd - overlapStart);
    return total - overlap;
  } else {
    const total1 = 24 - startDec;
    const overlapStart1 = Math.max(startDec, standardStart);
    const overlapEnd1 = Math.min(24, standardEnd);
    const overlap1 = Math.max(0, overlapEnd1 - overlapStart1);
    
    const total2 = endDec;
    const overlapStart2 = Math.max(0, standardStart);
    const overlapEnd2 = Math.min(endDec, standardEnd);
    const overlap2 = Math.max(0, overlapEnd2 - overlapStart2);
    
    return (total1 - overlap1) + (total2 - overlap2);
  }
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
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const result = employees.map(emp => {
      const record = attendanceRecords.find(r => r.employee.toString() === emp._id.toString());
      return {
        employee: emp,
        status: record ? record.status : 'ABSENT',
        checkIn: record ? record.checkIn : '—',
        breakStart: record ? record.breakStart : '—',
        breakEnd: record ? record.breakEnd : '—',
        checkOut: record ? record.checkOut : '—',
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
    const otHours = calculateOT(checkIn, checkOut);

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
        status, checkIn, breakStart, breakEnd, checkOut, 
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
