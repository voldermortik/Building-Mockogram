import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { env } from '@/config/env';
import { seedDatabase } from '@/db/seeding/seedDb';

let mongoMS: MongoMemoryServer;

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Start MongoDB Memory Server
    mongoMS = await MongoMemoryServer.create({
      instance: {
        port: env.MONGODB_PORT
      }
    });
    const uri = mongoMS.getUri();
    console.log(`MongoDB server running in memory at ${uri}`);

    // Connect to the in-memory database
    await mongoose.connect(uri + 'mgdata');
    console.log('Connected to in-memory MongoDB server');

    // Seed the database
    await seedDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const shutdownDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB server');
    await mongoMS.stop();
    console.log('MongoDB server in memory stopped');
  } catch (error) {
    console.error('Error during database shutdown:', error);
    throw error;
  }
}; 
