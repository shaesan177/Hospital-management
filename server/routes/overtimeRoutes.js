import express from 'express';
import Overtime from '../models/Overtime.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Get aggregated Overtime stats
router.get('/stats', async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const end = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0, 23, 59, 59);

    const stats = await Overtime.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$hours' },
          pendingApprovals: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          totalPayout: { $sum: { $multiply: ['$hours', 250] } } // Mock rate of 250 per hour
        }
      }
    ]);

    res.json(stats[0] || { totalHours: 0, pendingApprovals: 0, totalPayout: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Muster Roll data (Overtime hours per day for a month)
router.get('/muster-roll', async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth();
    const y = parseInt(year) || new Date().getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const employees = await Employee.find();
    const overtimeRecords = await Overtime.find({
      date: { $gte: start, $lte: end }
    });

    const musterRoll = employees.map(emp => {
      const daysInMonth = end.getDate();
      const dailyOT = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(y, m, i + 1);
        const record = overtimeRecords.find(r => 
          r.employee.toString() === emp._id.toString() && 
          new Date(r.date).toDateString() === date.toDateString()
        );
        return record ? { hours: record.hours, status: record.status, startTime: record.startTime, endTime: record.endTime } : null;
      });

      return {
        employee: emp,
        dailyOT
      };
    });

    res.json(musterRoll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve All Pending Overtime
router.post('/approve-all', async (req, res) => {
  try {
    await Overtime.updateMany({ status: 'Pending' }, { status: 'Approved' });
    res.json({ message: 'All pending overtime approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const overtime = await Overtime.find().populate('employee');
    res.json(overtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { employeeId, date, hours, task, status, startTime, endTime } = req.body;
    const overtime = await Overtime.findOneAndUpdate(
      { employee: employeeId, date: new Date(date).setHours(0,0,0,0) },
      { hours, task, status: status || 'Pending', startTime, endTime },
      { upsert: true, new: true }
    );
    res.status(201).json(overtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
