import express from 'express';
import Alert from '../models/Alert';

const router = express.Router();

// POST /api/alerts
router.post('/', async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
});

// GET /api/alerts
router.get('/', async (_req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
