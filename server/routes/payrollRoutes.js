import express from 'express';
import Employee from '../models/Employee.js';
import Overtime from '../models/Overtime.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth();
    const y = parseInt(year) || new Date().getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const employees = await Employee.find();
    
    const overtimes = await Overtime.find({
       date: { $gte: start, $lte: end },
       status: 'Approved'
    });

    const attendances = await Attendance.find({
       date: { $gte: start, $lte: end },
       status: 'ABSENT'
    });

    const payrollData = employees.map(emp => {
      const basic = emp.basicSalary || 0;
      
      const empOvertimes = overtimes.filter(o => o.employee && o.employee.toString() === emp._id.toString());
      const otHours = empOvertimes.reduce((sum, o) => sum + (o.hours || 0), 0);
      const otPay = otHours * 250; // Rate 250 per hour

      const empLeaves = attendances.filter(a => a.employee && a.employee.toString() === emp._id.toString());
      const leaveDays = empLeaves.length;
      
      let deductionDays = 0;
      if (leaveDays <= 2) {
        deductionDays = 0;
      } else if (leaveDays <= 5) {
        deductionDays = leaveDays - 2;
      } else {
        deductionDays = leaveDays;
      }

      const gross = basic + otPay;
      const dailyWage = basic / 30; // Assuming 30 days standard month
      const deductions = deductionDays * dailyWage;
      const net = gross - deductions;

      // Color logic for UI
      const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600'];
      const color = colors[emp.name.length % colors.length];

      return {
        _id: emp._id,
        name: emp.name,
        role: emp.designation,
        basic,
        otPay,
        gross,
        deductions,
        net,
        status: 'PENDING',
        initial: emp.name.substring(0, 2).toUpperCase(),
        color
      };
    });

    res.json(payrollData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
