import express from 'express';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Get attendance by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    const attendance = await Attendance.find(query).populate('employee');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update attendance (Manual Entry)
router.post('/', async (req, res) => {
  try {
    const { employeeId, date, status, entryTime, exitTime, natureOfWork } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: new Date(date).setHours(0,0,0,0) },
      { status, entryTime, exitTime, natureOfWork },
      { upsert: true, new: true }
    );
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
