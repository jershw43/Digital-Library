// backend/addUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const addUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get user details from command line
    const username = process.argv[2];
    const email = process.argv[3];
    const password = process.argv[4];

    if (!username || !email || !password) {
      console.log('❌ Usage: node addUser.js <username> <email> <password>');
      console.log('Example: node addUser.js johndoe john@example.com password123');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('❌ User with this email or username already exists');
      process.exit(1);
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();

    console.log('✅ User created successfully!');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('User ID:', user._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addUser();