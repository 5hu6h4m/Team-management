import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows Node.js DNS SRV resolution with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // ignore if not permitted
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
}
