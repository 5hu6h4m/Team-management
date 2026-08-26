import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { _id: false });

const activityLogSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  userId: { type: String, required: true },
  action: { type: String, required: true }
}, { _id: false });

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, default: '' },
  url: { type: String, default: '#' }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedById: { type: String, required: true },
  assignedToId: { type: String, required: true },
  department: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['Urgent', 'High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED'], 
    default: 'PENDING' 
  },
  deadline: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  submittedAt: { type: String },
  completedAt: { type: String },
  deliverableUrl: { type: String, default: '' },
  submissionNotes: { type: String, default: '' },
  subtasks: [subtaskSchema],
  attachments: [attachmentSchema],
  activityLog: [activityLogSchema]
}, {
  timestamps: true
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
