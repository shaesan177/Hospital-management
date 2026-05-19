import express from 'express';
import User from '../models/User.js';
import Role from '../models/Role.js';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

// Get Admin Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeRoles = await Role.countDocuments();
    const permissionChanges = await AuditLog.countDocuments({ type: 'PERMISSION' });
    
    res.json({
      totalUsers,
      activeRoles,
      permissionChanges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Role Management
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find();
    // In a real app, we'd count users for each role. 
    // Since roles are strings in User model, we can do:
    const rolesWithCounts = await Promise.all(roles.map(async (role) => {
      const userCount = await User.countDocuments({ role: role.name });
      return { ...role.toObject(), users: userCount };
    }));
    res.json(rolesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Give Access to Employee
router.post('/give-access', async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already has access' });
    }

    const newUser = new User({
      email,
      name,
      password,
      role
    });

    await newUser.save();
    
    // Log this action
    await AuditLog.create({
      type: 'PERMISSION',
      status: 'SUCCESS',
      title: 'Access Granted',
      meta: `Granted ${role} access to ${name} (${email})`
    });

    res.status(201).json({ message: 'Access granted successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(10);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/audit-logs', async (req, res) => {
  try {
    const log = new AuditLog(req.body);
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
