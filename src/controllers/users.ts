import { getAllUsersService } from '../services/userService';
import {IPagination } from '../contracts/users';

/**
 * Asynchronous function that retrieves a paginated list of users based on the provided query parameters.
 * It uses the getAllUsersService function to perform the actual retrieval.
 * 
 * @param {any} query - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<IPagination>} A promise resolving to the paginated list of users.
 */

export const getAllUsers = async (query:Record<string, any>) : Promise<IPagination> => {   
    try {
        // Dynamic search query
        const match: Record<string, any> = {};
        if (query.search) {
          const searchFields = JSON.parse(query.search);
          for (const field in searchFields) {
            if (field === 'name') {
                match.$or = [
                    { 'name.first': { $regex: searchFields[field], $options:'i' } },
                    { 'name.last': { $regex: searchFields[field], $options: 'i' } }
                  ];
            } else if (field === 'country' || field === 'city' || field === 'state') {
                match[`location.${field}`] = { $regex: searchFields[field], $options:'i' }
            } else if (field === 'age') {
                match['dob.age'] = searchFields[field] 
            } else if (field == 'gender') {
                match[field] = { $eq: searchFields[field]} 
            } else if (field === 'email') {
                match[field] = searchFields[field]
            }
          }
        }
    
        // Sorting logic
        let sort: Record<string, any> = {};
        let order: number = query.order === 'desc' ? -1 : 1;
        if (query.sortBy === 'name') {
        sort = { 'name.first': order, 'name.last': order };
        } else if (query.sortBy === 'country') {
            sort = {'location.country': order}
        } else if (query.sortBy === 'age') {
            sort = {'dob.age': order}
        } else {
        sort[query.sortBy || 'createdAt'] = order;
        }
        
        // Pagination logic
        const limit: number = Number(query.limit) || 10;
        const page: number = Number(query.page) || 1;
        const skip: number = (page - 1) * limit;
        return await getAllUsersService({match, sort, skip, limit, page});
    } catch(error: any) {
        throw error;
    }
}