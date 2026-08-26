import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import { User } from './models/User.js';
import { Task } from './models/Task.js';
import { Department } from './models/Department.js';
import { Notification } from './models/Notification.js';
import { Message } from './models/Message.js';

import { 
  INITIAL_USERS, 
  INITIAL_TASKS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_MESSAGES 
} from '../src/mock/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// DB Initialization & Auto-Seed Function
// ----------------------------------------------------
async function seedDatabaseIfEmpty() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial E-Cell TaskHub dataset into MongoDB...');
      await User.insertMany(INITIAL_USERS);
      await Task.insertMany(INITIAL_TASKS);
      await Department.insertMany(INITIAL_DEPARTMENTS);
      await Notification.insertMany(INITIAL_NOTIFICATIONS);
      await Message.insertMany(INITIAL_MESSAGES);
      console.log('✅ MongoDB Database seeded successfully!');
    } else {
      console.log(`📦 MongoDB already contains ${userCount} users and operational records.`);
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err.message);
  }
}

// ----------------------------------------------------
// Health Check Route
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    db: 'connected', 
    timestamp: new Date().toISOString() 
  });
});

// ----------------------------------------------------
// USERS API
// ----------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      id: req.body.id || `u-${Date.now()}`
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { id: req.params.id }, 
      { $set: req.body }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// TASKS API
// ----------------------------------------------------
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      id: req.body.id || `t-${Date.now()}`
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// DEPARTMENTS API
// ----------------------------------------------------
app.get('/api/departments', async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const newDept = new Department({
      ...req.body,
      id: req.body.id || req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    await newDept.save();
    res.status(201).json(newDept);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// NOTIFICATIONS API
// ----------------------------------------------------
app.get('/api/notifications', async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ timestamp: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const newNotif = new Notification({
      ...req.body,
      id: req.body.id || `n-${Date.now()}`
    });
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { $set: { read: true } },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/notifications/user/:userId/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// MESSAGES API
// ----------------------------------------------------
app.get('/api/messages', async (req, res) => {
  try {
    const msgs = await Message.find().sort({ timestamp: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMsg = new Message({
      ...req.body,
      id: req.body.id || `m-${Date.now()}`
    });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// RESET & SEED ROUTE
// ----------------------------------------------------
app.post('/api/seed/reset', async (req, res) => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    await Department.deleteMany({});
    await Notification.deleteMany({});
    await Message.deleteMany({});

    await User.insertMany(INITIAL_USERS);
    await Task.insertMany(INITIAL_TASKS);
    await Department.insertMany(INITIAL_DEPARTMENTS);
    await Notification.insertMany(INITIAL_NOTIFICATIONS);
    await Message.insertMany(INITIAL_MESSAGES);

    res.json({ message: 'Database reset and re-seeded successfully with fresh E-Cell data' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Start Server & Connect MongoDB
// ----------------------------------------------------
async function startServer() {
  const isConnected = await connectDB();
  if (isConnected) {
    await seedDatabaseIfEmpty();
  }

  app.listen(PORT, () => {
    console.log(`🚀 E-Cell TaskHub API Server running on port ${PORT}`);
  });
}

startServer();
