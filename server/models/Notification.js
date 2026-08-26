import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, default: 'assigned' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  read: { type: Boolean, default: false },
  taskId: { type: String }
}, {
  timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
