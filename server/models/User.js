import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['President', 'GS', 'Lead', 'Member'], 
    default: 'Member' 
  },
  department: { type: String, default: 'General' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  completionRate: { type: Number, default: 95 },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
