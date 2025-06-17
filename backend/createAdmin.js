import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const username = 'admin'; // change as needed
  const password = 'auction123'; // change as needed
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const admin = new Admin({ username, password: hashedPassword });
  await admin.save();
  console.log('Admin created:', username);
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
}); 