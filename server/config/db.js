const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('../seed');

const connectDB = async () => {
  try {
    // Attempt Atlas connection with shorter timeout to fail fast
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Atlas Connection Failed: ${error.message}`);
    console.log('🔄 Falling back to In-Memory MongoDB Server...');
    
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ In-Memory MongoDB Started successfully');
      
      // Auto-seed memory database
      console.log('🌱 Auto-seeding memory database...');
      await seedData(false);
    } catch (memError) {
      console.error(`❌ Memory Server Failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

module.exports = connectDB;
