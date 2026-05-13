import express from 'express';
import Holiday from '../models/Holiday.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const holidays = await Holiday.find().populate('employee');
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const holiday = new Holiday(req.body);
  try {
    const newHoliday = await holiday.save();
    res.status(201).json(newHoliday);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
