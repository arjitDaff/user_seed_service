import {IItems, IPagination } from '../contracts/users';
import {UserModel} from '../models/users';
import logger from '../utils/logger';
import {IUser} from '../models/users'

/**
 * Asynchronous service function that inserts an array of user data into the database using
 * the UserModel.insertMany method. It also logs the number of users created.
 * 
 * @param {Array<any>} users - An array of user data to be inserted.
 * @throws {Error} If an error occurs during the execution, it is propagated up.
 */
export const insertUsersService = async (users: Array<IUser>) => {
    try {
        logger.info('started inserting');
        if (users.length !== 0) {
            await UserModel.insertMany(users);
        }
        logger.info(`${users.length} users created successfully`)
    } catch (error: any) {
        throw error;
    }
};

/**
 * Service function for retrieving a paginated list of users based on the provided query parameters.
 * 
 * @param {any} query - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<IPagination>} A promise resolving to the paginated list of users.
 */
export const getAllUsersService = async (query: Record<string, any>) : Promise<IPagination> => {   
    try {
        const { match, sort, skip, limit, page } = query;
        //Quering user collection
        const users = await UserModel.find(match).sort(sort).skip(skip).limit(limit);
        const usersCount = await UserModel.find(match).countDocuments();
    
         // Maping users to IItems format
         const items: IItems[] = users.map(user => ({
            id: user._id.toString(),
            gender: user.gender,
            name: `${user.name.first} ${user.name.last}`,
            address: {
                city: user.location.city,
                state: user.location.state,
                street: `${user.location.street.number} ${user.location.street.name}`,
                country: user.location.country
            },
            email: user.email,
            age: String(user.dob.age),
            picture: user.picture.large,
            createdAt: user.createdAt,
          }));
        const totalCount = usersCount;
    
        return { total: totalCount, limit, page, sortBy: query.sortBy || '', items };
    } catch(e) {
        throw e;
    }
} 