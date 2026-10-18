import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

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

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// ----------------------------------------------------
// In-Memory Fallback Storage (when MongoDB unavailable)
// ----------------------------------------------------
let useMongoDB = false;
let memoryStore = {
  users: [...INITIAL_USERS],
  tasks: [...INITIAL_TASKS],
  departments: [...INITIAL_DEPARTMENTS],
  notifications: [...INITIAL_NOTIFICATIONS],
  messages: [...INITIAL_MESSAGES]
};

// Helper to simulate MongoDB-like operations on memory store
const memoryDB = {
  users: {
    find: () => Promise.resolve([...memoryStore.users].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))),
    findOne: (query) => Promise.resolve(memoryStore.users.find(u => u.id === query.id) || null),
    insertMany: (docs) => { memoryStore.users.push(...docs); return Promise.resolve(docs); },
    findOneAndUpdate: (query, update, options) => {
      const idx = memoryStore.users.findIndex(u => u.id === query.id);
      if (idx === -1) return Promise.resolve(null);
      memoryStore.users[idx] = { ...memoryStore.users[idx], ...update.$set, updatedAt: new Date().toISOString() };
      return Promise.resolve(options.new ? memoryStore.users[idx] : memoryStore.users[idx]);
    },
    findOneAndDelete: (query) => {
      const idx = memoryStore.users.findIndex(u => u.id === query.id);
      if (idx === -1) return Promise.resolve(null);
      const deleted = memoryStore.users.splice(idx, 1)[0];
      return Promise.resolve(deleted);
    },
    deleteMany: () => { memoryStore.users = []; return Promise.resolve({}); },
    countDocuments: () => Promise.resolve(memoryStore.users.length),
    updateMany: (query, update) => {
      memoryStore.users = memoryStore.users.map(u => 
        u.id === query.id ? { ...u, ...update.$set } : u
      );
      return Promise.resolve({});
    }
  },
  tasks: {
    find: () => Promise.resolve([...memoryStore.tasks].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))),
    findOne: (query) => Promise.resolve(memoryStore.tasks.find(t => t.id === query.id) || null),
    insertMany: (docs) => { memoryStore.tasks.push(...docs); return Promise.resolve(docs); },
    findOneAndUpdate: (query, update, options) => {
      const idx = memoryStore.tasks.findIndex(t => t.id === query.id);
      if (idx === -1) return Promise.resolve(null);
      memoryStore.tasks[idx] = { ...memoryStore.tasks[idx], ...update.$set, updatedAt: new Date().toISOString() };
      return Promise.resolve(options.new ? memoryStore.tasks[idx] : memoryStore.tasks[idx]);
    },
    findOneAndDelete: (query) => {
      const idx = memoryStore.tasks.findIndex(t => t.id === query.id);
      if (idx === -1) return Promise.resolve(null);
      return Promise.resolve(memoryStore.tasks.splice(idx, 1)[0]);
    },
    deleteMany: () => { memoryStore.tasks = []; return Promise.resolve({}); }
  },
  departments: {
    find: () => Promise.resolve([...memoryStore.departments]),
    insertMany: (docs) => { memoryStore.departments.push(...docs); return Promise.resolve(docs); },
    deleteMany: () => { memoryStore.departments = []; return Promise.resolve({}); }
  },
  notifications: {
    find: () => Promise.resolve([...memoryStore.notifications].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))),
    insertMany: (docs) => { memoryStore.notifications.push(...docs); return Promise.resolve(docs); },
    findOneAndUpdate: (query, update, options) => {
      const idx = memoryStore.notifications.findIndex(n => n.id === query.id);
      if (idx === -1) return Promise.resolve(null);
      memoryStore.notifications[idx] = { ...memoryStore.notifications[idx], ...update.$set };
      return Promise.resolve(options.new ? memoryStore.notifications[idx] : memoryStore.notifications[idx]);
    },
    updateMany: (query, update) => {
      memoryStore.notifications = memoryStore.notifications.map(n => 
        n.userId === query.userId ? { ...n, ...update.$set } : n
      );
      return Promise.resolve({});
    },
    deleteMany: () => { memoryStore.notifications = []; return Promise.resolve({}); }
  },
  messages: {
    find: () => Promise.resolve([...memoryStore.messages].sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0))),
    insertMany: (docs) => { memoryStore.messages.push(...docs); return Promise.resolve(docs); },
    deleteMany: () => { memoryStore.messages = []; return Promise.resolve({}); }
  }
};

// Import MongoDB models (only used if MongoDB connects)
import { User } from './models/User.js';
import { Task } from './models/Task.js';
import { Department } from './models/Department.js';
import { Notification } from './models/Notification.js';
import { Message } from './models/Message.js';

const mongoDB = { User, Task, Department, Notification, Message };

// Helper to get the right DB
const db = () => useMongoDB ? mongoDB : memoryDB;

// ----------------------------------------------------
// Health Check Route
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    db: useMongoDB ? 'connected (MongoDB)' : 'connected (in-memory fallback)',
    timestamp: new Date().toISOString() 
  });
});

// ----------------------------------------------------
// USERS API
// ----------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const users = await db().users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = {
      ...req.body,
      id: req.body.id || `u-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const saved = await db().users.insertMany([newUser]);
    res.status(201).json(saved[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updated = await db().users.findOneAndUpdate(
      { id: req.params.id }, 
      { $set: { ...req.body, updatedAt: new Date().toISOString() } }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const user = await db().users.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    const updated = await db().users.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: nextStatus, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await db().users.findOneAndDelete({ id: req.params.id });
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
    const tasks = await db().tasks.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = {
      ...req.body,
      id: req.body.id || `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const saved = await db().tasks.insertMany([newTask]);
    res.status(201).json(saved[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await db().tasks.findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...req.body, updatedAt: new Date().toISOString() } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await db().tasks.findOneAndDelete({ id: req.params.id });
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
    const depts = await db().departments.find();
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const newDept = {
      ...req.body,
      id: req.body.id || req.body.name.toLowerCase().replace(/\s+/g, '-')
    };
    const saved = await db().departments.insertMany([newDept]);
    res.status(201).json(saved[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// NOTIFICATIONS API
// ----------------------------------------------------
app.get('/api/notifications', async (req, res) => {
  try {
    const notifs = await db().notifications.find();
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const newNotif = {
      ...req.body,
      id: req.body.id || `n-${Date.now()}`,
      timestamp: req.body.timestamp || new Date().toISOString()
    };
    const saved = await db().notifications.insertMany([newNotif]);
    res.status(201).json(saved[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await db().notifications.findOneAndUpdate(
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
    await db().notifications.updateMany(
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
    const msgs = await db().messages.find();
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMsg = {
      ...req.body,
      id: req.body.id || `m-${Date.now()}`,
      timestamp: req.body.timestamp || new Date().toISOString()
    };
    const saved = await db().messages.insertMany([newMsg]);
    res.status(201).json(saved[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// RESET & SEED ROUTE
// ----------------------------------------------------
app.post('/api/seed/reset', async (req, res) => {
  try {
    await db().users.deleteMany({});
    await db().tasks.deleteMany({});
    await db().departments.deleteMany({});
    await db().notifications.deleteMany({});
    await db().messages.deleteMany({});

    await db().users.insertMany(INITIAL_USERS);
    await db().tasks.insertMany(INITIAL_TASKS);
    await db().departments.insertMany(INITIAL_DEPARTMENTS);
    await db().notifications.insertMany(INITIAL_NOTIFICATIONS);
    await db().messages.insertMany(INITIAL_MESSAGES);

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
  useMongoDB = isConnected;
  
  if (isConnected) {
    console.log('✅ Using MongoDB for data persistence');
    // Seed if empty
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
      }
    } catch (err) {
      console.error('Error during auto-seeding:', err.message);
    }
  } else {
    console.log('⚠️  MongoDB not available - using in-memory storage (data resets on server restart)');
    console.log('💡 To enable persistence: install MongoDB locally or set MONGODB_URI to MongoDB Atlas');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 E-Cell TaskHub API Server running on port ${PORT}`);
    console.log(`🌐 Network access: http://0.0.0.0:${PORT} or http://<your-ip>:${PORT}`);
  });
}

startServer();