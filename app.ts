import express, {Application, NextFunction, Request, Response} from 'express';
import {connect} from "mongoose";
import 'dotenv/config'
import { jobScheduler } from './src/services/scheduler';
import logger from './src/utils/logger';
import userRoutes from './src/routes/users';

// Fetching environment variables
const DATABASE_CONNECTION_STRING: string = process.env.MONGODB_URI || '';
const PORT: number = Number(process.env.PORT) || 3000;

// Initializing express application
const app: Application = express();

// Mounting routes
app.use('/api/users', userRoutes.router);

// Handling requests which have undefined routes
app.all('*', (req:Request, res:Response, next:NextFunction) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error handler
app.use((err: Error, req : Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({
    error: err,
    message: err.message
  })
});

let server; 
// Function to initialize database connection and start the server
async function startServer() {
  try {
    await connect(DATABASE_CONNECTION_STRING);
    logger.info('Database connected');

    // Start the express server
    server = app.listen(PORT, () => {
      logger.info(`Connected successfully on port ${PORT}`);
    });

    // Start scheduler to fetch users after the database is connected
    jobScheduler();

  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1); // Exiting the process on database connection failure
  }
}

// Calling the startServer function
startServer();

// Handling unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
    process.exit(1);
});
