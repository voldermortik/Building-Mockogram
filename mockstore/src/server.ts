import express from 'express';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes';
import { seedDatabase } from './db/seedDb';
import { setupMongoDB,
shutdownServer } from './db/manageDb';
import { env } from './config/env';

const app = express();
const port = env.APP_PORT;

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.use(`/${env.EXTERNAL_FILE_DIR_NAME}`, express.static(env.INTERNAL_FILE_DIR_NAME));
app.use(`${env.API_URL}/images`, imageRoutes);

process.on('SIGTERM', () => shutdownServer('SIGTERM').catch(console.error));
process.on('SIGINT', () => shutdownServer('SIGINT').catch(console.error));

const startServer = async (): Promise<void> => {
  await setupMongoDB();
  await seedDatabase();
  
  app.listen(port, () => {
    console.log(`Mockstore backend is running on http://localhost:${port}`);
  });
};

startServer().catch(console.error); 
