import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, default: 'Layers' },
  leadId: { type: String, default: '' },
  color: { type: String, default: 'blue' }
}, {
  timestamps: true
});

export const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
