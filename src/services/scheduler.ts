import { REQUEST_INTERVAL, RESCHEDULE_INTERVAL } from '../constants/appConstants';
import { IUser } from '../models/users';
import logger from '../utils/logger';
import { insertUsersService } from './userService';
import axiosInstance from '../utils/axios';
import { API_URI, BATCH_SIZE } from '../constants/appConstants';

// Queue to store users
const userQueue: Array<Array<IUser>> = [];
// Flag to determine if processing is in progress
let processingInProgress = false;

/**
 * Schedules a periodic job to fetch users and handles failures with retry logic.
 */
export const jobScheduler = () => {
    let interval: ReturnType<typeof setInterval>;
    interval = setInterval(async () => {
        try {
            const users: Array<IUser> = await fetchUsers();
            userQueue.push(users);
            processQueue();
        } catch (error: any) {
            clearInterval(interval);
            logger.info(`Failure fetching user: ${error.message}. Try decreasing the batch size`);
            setTimeout(jobScheduler, RESCHEDULE_INTERVAL * 1000);
        }
    }, REQUEST_INTERVAL * 1000)
}

/**
 * Fetches user data from an external API using Axios.
 *
 * @returns {Array} An array of user results from the external API.
 * @throws {Error} Throws an error if the API request fails.
 */
async function fetchUsers() {
    try {
        logger.info('Started fetching users from external Api');
        const response = await axiosInstance.get(API_URI, { params: { results: BATCH_SIZE } });
        return response?.data?.results
    } catch (error: any) {
        throw error;
    }
}

/**
 * Processes the user queue, inserting batches of users into the database.
 * If processing is already in progress or the queue is empty, the function exits.
 * This make sure that only one batch of users is inserted at a time.
 */
async function processQueue() {
    if (userQueue.length === 0 || processingInProgress) {
        return;
    }
    const users: Array<IUser> | undefined = userQueue.shift();
    if (users === undefined) {
        return;
    }
    logger.info('Processing user queue');
    processingInProgress = true;
    try {
        await insertUsersService(users);
    } finally {
        processingInProgress = false;
        processQueue();
    }
}

