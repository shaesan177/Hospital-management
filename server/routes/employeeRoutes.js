import express from 'express';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';

const router = express.Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create employee
router.post('/', async (req, res) => {
  const employee = new Employee(req.body);
  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });

    // Recalculate current month's payroll to reflect any OT/Deduction rate changes
    const d = new Date();
    const m = d.getMonth();
    const y = d.getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const attendances = await Attendance.find({
      employee: updatedEmployee._id,
      date: { $gte: start, $lte: end },
      status: 'PRESENT'
    });

    let totalWorkingDays = 0;
    let totalWorkedHours = 0;
    let totalOTHours = 0;
    let totalDeductionHours = 0;

    const dailyHoursConfig = updatedEmployee.workingHoursPerDay || 10;
    const otRate = updatedEmployee.otRatePerHour || 0;
    const deductionRate = updatedEmployee.deductionRatePerHour || 0;

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

    const baseSalary = updatedEmployee.basicSalary || 0;
    const finalSalary = baseSalary + totalOTAmount - totalDeductionAmount;

    await Payroll.findOneAndUpdate(
      { employee: updatedEmployee._id, month: m, year: y, status: 'PENDING' },
      {
        totalWorkingDays,
        totalWorkedHours,
        totalOTHours,
        totalOTAmount,
        totalDeductionHours,
        totalDeductionAmount,
        baseSalary,
        finalSalary
      }
    );

    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
