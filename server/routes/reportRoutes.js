import express from 'express';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Overtime from '../models/Overtime.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 1. Top Stats
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'ON-DUTY' });
    const onLeaveEmployees = await Employee.countDocuments({ status: 'ON-LEAVE' });

    // Calculate Avg Attendance (Mocking variance for now)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const totalAttendance = await Attendance.countDocuments({ date: { $gte: thirtyDaysAgo } });
    const presentAttendance = await Attendance.countDocuments({ date: { $gte: thirtyDaysAgo }, status: 'PRESENT' });
    const avgAttendancePerc = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(1) : '0.0';

    // Calculate Overtime Cost (Assuming ₹500/hr)
    const overtimeData = await Overtime.aggregate([
      { $match: { status: 'Approved', date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, totalHours: { $sum: '$hours' } } }
    ]);
    const totalOvertimeHours = overtimeData.length > 0 ? overtimeData[0].totalHours : 0;
    const overtimeCost = totalOvertimeHours * 500;
    
    // Format Overtime Cost
    const formatCurrency = (val) => {
      if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
      return `₹${val}`;
    };

    const topStats = [
      { 
        label: 'TOTAL HEADCOUNT', 
        value: totalEmployees.toString(), 
        trend: '+2.4%', 
        detail1: `Active: ${activeEmployees}`, 
        detail2: `On Leave: ${onLeaveEmployees}`, 
        color: 'text-emerald-500' 
      },
      { 
        label: 'AVG. ATTENDANCE', 
        value: `${avgAttendancePerc}%`, 
        trend: '-0.8%', 
        detail1: 'Target: 95%', 
        detail2: `Variance: ${(avgAttendancePerc - 95).toFixed(1)}%`, 
        color: avgAttendancePerc >= 95 ? 'text-emerald-500' : 'text-rose-500' 
      },
      { 
        label: 'MONTHLY PAYROLL', 
        value: '₹2.4M', // Mocked as no salary data exists
        trend: '+4.1%', 
        detail1: 'Salary: ₹2.1M', 
        detail2: 'Bonus: ₹0.3M', 
        color: 'text-emerald-500' 
      },
      { 
        label: 'OVERTIME COST', 
        value: formatCurrency(overtimeCost), 
        trend: '+12%', 
        detail1: 'Budget: ₹150K', 
        detail2: `Remaining: ₹${(150000 - overtimeCost) > 0 ? ((150000 - overtimeCost)/1000).toFixed(1) + 'K' : '0'}`, 
        color: 'text-amber-500' 
      },
    ];

    // 2. Departmental Breakdown
    const deptColors = ['bg-emerald-500', 'bg-blue-600', 'bg-amber-500', 'bg-emerald-400', 'bg-slate-400'];
    const departmentStats = await Employee.aggregate([
      { $group: { _id: '$department', staff: { $sum: 1 } } },
      { $sort: { staff: -1 } }
    ]);

    const departmentalBreakdown = departmentStats.map((dept, index) => {
      // Mocking efficiency and budget based on staff count for now, since we don't have this exact data easily available
      const efficiency = (80 + Math.random() * 18).toFixed(1);
      const budget = Math.floor(40 + Math.random() * 55);
      return {
        name: dept._id || 'Unassigned',
        staff: dept.staff,
        efficiency: `${efficiency}%`,
        budget: budget,
        color: deptColors[index % deptColors.length]
      };
    });

    // 3. Overtime Analysis (Recent)
    const recentOvertimes = await Overtime.find({ status: 'Approved' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('employee');

    const overtimeAnalysis = recentOvertimes.map(ot => {
      const hours = ot.hours;
      const cost = hours * 500;
      let intensity = 'STANDARD';
      let intensityColor = 'bg-blue-50 text-blue-600 border-blue-100';

      if (hours > 10) {
        intensity = 'CRITICAL';
        intensityColor = 'bg-rose-50 text-rose-600 border-rose-100';
      } else if (hours >= 5) {
        intensity = 'HIGH';
        intensityColor = 'bg-orange-50 text-orange-600 border-orange-100';
      } else if (hours < 2) {
        intensity = 'LOW';
        intensityColor = 'bg-slate-50 text-slate-500 border-slate-100';
      }

      return {
        ref: `#OT-${ot._id.toString().substring(18, 24).toUpperCase()}`,
        unit: ot.employee ? ot.employee.department : 'Unknown',
        hours: `${hours} hrs`,
        cost: `₹${cost}`,
        intensity,
        intensityColor
      };
    });

    // 4. Staff Distribution Data
    const totalStaff = totalEmployees;
    const medicalStaff = await Employee.countDocuments({ department: { $in: ['Cardiology', 'Neurology', 'Emergency', 'Surgery'] } });
    const adminStaff = await Employee.countDocuments({ department: 'Admin' });
    const supportStaff = totalStaff - medicalStaff - adminStaff;
    
    const staffDistribution = [
      { label: 'Medical Staff', value: totalStaff > 0 ? `${Math.round((medicalStaff/totalStaff)*100)}%` : '0%', count: medicalStaff, color: 'bg-[#003896]' },
      { label: 'Administrative', value: totalStaff > 0 ? `${Math.round((adminStaff/totalStaff)*100)}%` : '0%', count: adminStaff, color: 'bg-[#2563eb]' },
      { label: 'Support Services', value: totalStaff > 0 ? `${Math.round((supportStaff/totalStaff)*100)}%` : '0%', count: supportStaff, color: 'bg-[#cbd5e1]' },
    ];

    res.json({
      topStats,
      departmentalBreakdown,
      overtimeAnalysis,
      staffDistribution,
      totalHeadcount: totalStaff
    });
  } catch (error) {
    console.error('Error fetching reports data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
