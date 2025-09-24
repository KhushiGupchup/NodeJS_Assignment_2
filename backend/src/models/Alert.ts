import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  userEmail: string;
  cryptoSymbol: string; // 'bitcoin' or 'ethereum'
  condition: '>' | '<';
  targetPrice: number;
  notified: boolean;
}

const alertSchema = new Schema<IAlert>({
  userEmail: { type: String, required: true },
  cryptoSymbol: { type: String, required: true },
  condition: { type: String, enum: ['>', '<'], required: true },
  targetPrice: { type: Number, required: true },
  notified: { type: Boolean, default: false },
});

export default mongoose.model<IAlert>('Alert', alertSchema);
