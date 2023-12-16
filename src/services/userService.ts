import { IResponse } from '../contracts/IResponse';
import { IItem } from '../contracts/IItem';
import { UserModel } from '../models/users';
import logger from '../utils/logger';
import { IUser } from '../models/users'

/**
 * Function that inserts an array of user data into the database
 * @param {Array<any>} users - An array of user data to be inserted.
 * @throws {Error} If an error occurs during the execution, it is propagated up.
 */
export const insertUsers = async (users: Array<IUser>) => {
    logger.info('Started inserting');
    if (users.length) {
        await UserModel.insertMany(users);
        logger.info(`${users.length} users created successfully`)
    } else {
        logger.info('No users to insert');
    }
};

/**
 * Function for retrieving a paginated list of users based on the provided query parameters.
 * 
 * @param {any} query - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<IResponse>} A promise resolving to the paginated list of users.
 */
export const getAllUsers = async (query: Record<string, any>): Promise<IResponse> => {
    const { match, sort, skip, limit, page } = query;
    //Quering user collection
    const users = await UserModel.find(match).sort(sort).skip(skip).limit(limit);
    const usersCount = await UserModel.find(match).countDocuments();

    // Maping users to IItem format
    const items: IItem[] = users.map(user => ({
        id: user._id.toString(),
        gender: user.gender,
        name: `${user.name?.first} ${user.name?.last}`,
        address: {
            city: user.location?.city,
            state: user.location?.state,
            street: `${user.location.street?.number} ${user.location.street?.name}`,
            country: user.location?.country
        },
        email: user?.email,
        age: String(user.dob?.age),
        picture: user.picture?.large,
        createdAt: user.createdAt,
    }));
    const totalCount = usersCount;

    return { total: totalCount, limit, page, sortBy: query.sortBy || '', items };
} 
