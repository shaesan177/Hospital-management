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

router.post('/roles', async (req, res) => {
  try {
    const role = new Role(req.body);
    const newRole = await role.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/roles/:id', async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Security Audit Logs
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
