import { REQUEST_INTERVAL, RESCHEDULE_INTERVAL } from '../constants/appConstants';
import { IUser } from '../models/users';
import logger from '../utils/logger';
import { insertUsers } from './userService';
import axiosInstance from '../utils/axios';
import { API_URI, BATCH_SIZE } from '../constants/appConstants';

// Queue to store users
const userQueue: Array<Array<IUser>> = [];
// Flag to determine if processing is in progress
let isRecordsProcessing = false;

/**
 * Schedules a periodic job to fetch users and handles failures with retry logic.
 */
export const initScheduler = () => {
    let interval: ReturnType<typeof setInterval>;
    const requestInterval = Number(process.env.REQUEST_INTERVAL) || REQUEST_INTERVAL;
    const rescheduleInterval = Number(process.env.RESCHEDULE_INTERVAL) || RESCHEDULE_INTERVAL;
    interval = setInterval(async () => {
        try {
            const users: Array<IUser> = await fetchUsers();
            userQueue.push(users);
            processQueue();
        } catch (error: any) {
            clearInterval(interval);
            logger.info(`Failure fetching user: ${error.message}. Try decreasing the batch size`);
            setTimeout(initScheduler, rescheduleInterval * 1000);
        }
    }, requestInterval* 1000)
}

/**
 * Fetches user data from an external API using Axios.
 *
 * @returns {Array} An array of user results from the external API.
 * @throws {Error} Throws an error if the API request fails.
 */
async function fetchUsers() {
    const batchSize = Number(process.env.BATCH_SIZE) || BATCH_SIZE;
    logger.info('Started fetching users from external Api');
    const response = await axiosInstance.get(API_URI, { params: { results: batchSize } });
    return response?.data?.results
}

/**
 * Processes the user queue, inserting batches of users into the database.
 * If processing is already in progress or the queue is empty, the function exits.
 * This make sure that only one batch of users is inserted at a time.
 */
async function processQueue() {
    if (!userQueue.length || isRecordsProcessing) {
        return;
    }
    const users: Array<IUser> | undefined = userQueue.shift();
    if (!users) {
        return;
    }
    logger.info('Processing user queue');
    isRecordsProcessing = true;
    try {
        await insertUsers(users);
    } 
    catch(e) {
        logger.error('Error inserting users', e);
    }
    finally {
        isRecordsProcessing = false;
        processQueue();
    }
}
