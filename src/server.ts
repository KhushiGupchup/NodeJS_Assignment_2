import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

import Alert from './models/Alert';
import { startPricePolling } from './jobs/pollPrices';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crypto_alerts';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// POST /alerts to create alert criteria
app.post('/alerts', async (req, res) => {
  const { userEmail, cryptoSymbol, condition, targetPrice } = req.body;

  if (!userEmail || !cryptoSymbol || !condition || !targetPrice) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!['bitcoin', 'ethereum'].includes(cryptoSymbol)) {
    return res.status(400).json({ message: 'Invalid cryptoSymbol' });
  }

  if (!['>', '<'].includes(condition)) {
    return res.status(400).json({ message: 'Invalid condition' });
  }

  try {
    const alert = await Alert.create({ userEmail, cryptoSymbol, condition, targetPrice, notified: false });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

startPricePolling(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
