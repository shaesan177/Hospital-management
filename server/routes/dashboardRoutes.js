import express from 'express';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Overtime from '../models/Overtime.js';
import Holiday from '../models/Holiday.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Basic Stats
    const totalEmployees = await Employee.countDocuments();
    const presentToday = await Attendance.countDocuments({
      date: { $gte: today },
      status: 'PRESENT'
    });
    const onLeave = await Employee.countDocuments({ status: 'ON-LEAVE' });

    // 2. Attendance Trend (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const attendanceTrend = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo },
          status: 'PRESENT'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 3. Overtime Analytics (By Department)
    const overtimeAnalytics = await Overtime.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      { $unwind: '$employeeDetails' },
      {
        $group: {
          _id: '$employeeDetails.department',
          totalHours: { $sum: '$hours' }
        }
      },
      { $limit: 5 }
    ]);

    // 4. Upcoming Holidays (Mocking some for now as per dashboard requirements or fetching from Holiday model)
    // The dashboard shows system-wide holidays which aren't in the current Holiday model (which is for leave requests).
    // For now, I'll return a few "Global" ones plus approved leave requests.
    const upcomingLeaves = await Holiday.find({
      startDate: { $gte: today },
      status: 'Approved'
    }).populate('employee').limit(3);

    res.json({
      stats: {
        totalEmployees,
        presentToday,
        onLeave,
      },
      attendanceTrend,
      overtimeAnalytics,
      upcomingHolidays: upcomingLeaves.map(h => ({
        name: `${h.employee.name} (${h.type})`,
        date: h.startDate,
        type: h.type
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
