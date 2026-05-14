import express from 'express';
import Leave from '../models/Leave.js';

const router = express.Router();

// Add leave
router.post('/add', async (req, res) => {
  const { leaveDate, reason, leaveDays } = req.body;
  try {
    const newLeave = new Leave({ leaveDate, reason, leaveDays });
    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all leaves
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ leaveDate: 1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch upcoming leaves
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const leaves = await Leave.find({ leaveDate: { $gte: today } }).sort({ leaveDate: 1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete leave
router.delete('/:id', async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
