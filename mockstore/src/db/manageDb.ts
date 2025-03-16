import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { env } from '@/config/env';

let mongoMS: MongoMemoryServer;
let shuttingDown = false;

export const setupMongoDB = async (): Promise<MongoMemoryServer> => {
  mongoMS = await MongoMemoryServer.create({
    instance: { port: env.MONGODB_PORT }
  });

  const uri = mongoMS.getUri();
  console.log(`MongoDB server running in memory at ${uri}`);

  await mongoose.connect(uri + 'msdata');
  console.log('Connected to in-memory MongoDB server');

  return mongoMS;
};

export const shutdownMongoMS = async (): Promise<void> => {
  await mongoMS.stop();
  console.log(`\nMongoDB server in memory stopped`);
};

export const shutdownServer = async (signalType: string): Promise<void> => {
  if (shuttingDown) {
    console.log(`${signalType} signal received but already shutting down`);
    return;
  }
  shuttingDown = true;
  console.log(`Shutting down server`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB server');
  await shutdownMongoMS();
  process.exit(0);
}; 
