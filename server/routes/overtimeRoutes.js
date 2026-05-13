import express from 'express';
import Overtime from '../models/Overtime.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const overtime = await Overtime.find().populate('employee');
    res.json(overtime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const overtime = new Overtime(req.body);
  try {
    const newOvertime = await overtime.save();
    res.status(201).json(newOvertime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
