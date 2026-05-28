import express from 'express';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';

const router = express.Router();

async function generatePayrollForMonth(m, y) {
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0, 23, 59, 59);

  const employees = await Employee.find();
  
  for (const emp of employees) {
    const attendances = await Attendance.find({
      employee: emp._id,
      date: { $gte: start, $lte: end },
      status: 'PRESENT'
    });

    let totalWorkingDays = 0;
    let totalWorkedHours = 0;
    let totalOTHours = 0;
    let totalDeductionHours = 0;

    const dailyHoursConfig = emp.workingHoursPerDay || 10;
    const otRate = emp.otRatePerHour || 0;
    const deductionRate = emp.deductionRatePerHour || 0;

    let totalOTAmount = 0;
    let totalDeductionAmount = 0;

    for (const record of attendances) {
      if (record.checkIn && record.checkOut) {
        totalWorkingDays++;
        const diffMs = new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime();
        let hours = diffMs / (1000 * 60 * 60);
        
        if (hours < 0) hours += 24;
        hours = Math.max(0, hours);
        totalWorkedHours += hours;

        let dailyOT = 0;
        
        if (hours > dailyHoursConfig) {
          dailyOT = hours - dailyHoursConfig;
          totalOTHours += dailyOT;
          totalOTAmount += (dailyOT * otRate);
        } else if (hours < dailyHoursConfig) {
          const dailyDed = dailyHoursConfig - hours;
          totalDeductionHours += dailyDed;
          totalDeductionAmount += (dailyDed * deductionRate);
        }
        
        // Update daily attendance record with OT hours
        record.totalHours = hours;
        record.otHours = dailyOT;
        await record.save();
      }
    }

    const baseSalary = emp.basicSalary || 0;
    const finalSalary = baseSalary + totalOTAmount - totalDeductionAmount;

    await Payroll.findOneAndUpdate(
      { employee: emp._id, month: m, year: y },
      {
        employee: emp._id,
        month: m,
        year: y,
        totalWorkingDays,
        totalWorkedHours,
        totalOTHours,
        totalOTAmount,
        totalDeductionHours,
        totalDeductionAmount,
        baseSalary,
        finalSalary,
        status: 'PENDING'
      },
      { upsert: true, new: true }
    );
  }
}

router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth();
    const y = parseInt(year) || new Date().getFullYear();

    let payrolls = await Payroll.find({ month: m, year: y }).populate('employee');
    
    // If no payrolls exist for this month, auto-generate them
    if (payrolls.length === 0) {
      await generatePayrollForMonth(m, y);
      payrolls = await Payroll.find({ month: m, year: y }).populate('employee');
    }
    
    // Map to UI format
    const payrollData = payrolls.map(p => {
      const emp = p.employee;
      const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600'];
      const color = emp ? colors[emp.name.length % colors.length] : 'bg-slate-100 text-slate-600';
      const name = emp ? emp.name : 'Unknown';

      return {
        _id: p._id,
        employeeId: emp ? emp._id : null,
        name: name,
        role: emp ? emp.designation : 'N/A',
        basic: p.baseSalary,
        otPay: p.totalOTAmount,
        otHours: p.totalOTHours,
        deductions: p.totalDeductionAmount,
        deductionHours: p.totalDeductionHours,
        gross: p.baseSalary + p.totalOTAmount,
        net: p.finalSalary,
        status: p.status,
        initial: name.substring(0, 2).toUpperCase(),
        color,
        otRatePerHour: emp ? emp.otRatePerHour : 0,
        deductionRatePerHour: emp ? emp.deductionRatePerHour : 0,
        totalWorkingDays: p.totalWorkingDays || 1
      };
    });

    res.json(payrollData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { month, year } = req.body;
    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(m) || isNaN(y)) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    await generatePayrollForMonth(m, y);

    res.json({ message: 'Payroll generated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
