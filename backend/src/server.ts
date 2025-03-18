import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import {
  initializeDatabase,
  shutdownDatabase
} from './db/manageDb';

import postRoutes from '@/routes/postsRoutes';

// *********************************************************************************  
// Server configuration and route setup
// *********************************************************************************

const app = express();
const port: number = env.APP_PORT;

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(`${env.API_URL}/posts`, postRoutes);

// *********************************************************************************  
// Server initialization
// *********************************************************************************

const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(port, () => {
      console.log(`Mockagram backend is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// *********************************************************************************
// Server shutdown and teardown
// *********************************************************************************

let shuttingDown = false;

const shutdownServer = async (signalType: string): Promise<void> => {
  console.log(`\n${signalType} signal received`);

  if (shuttingDown) {
    console.log(`${signalType} signal received but already shutting down`);
    return;
  }
  shuttingDown = true;
  console.log(`Shutting down server`);
  await shutdownDatabase();
  process.exit(0);
};

process.on('SIGTERM', () => {
  shutdownServer('SIGTERM');
});

process.on('SIGINT', () => {
  shutdownServer('SIGINT');
});

export { app }; 
