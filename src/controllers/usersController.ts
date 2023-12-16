import * as userService from '../services/userService';
import { IResponse } from '../contracts/IResponse';

// Function to apply search field to the match object
const applySearchField = (field: string, searchFieldValue: string, match: Record<string, any>) => {
    switch (field) {
        case 'name':
            match.$or = [
                {
                    $expr: {
                        $eq: [
                            {
                                $concat: [
                                    "$name.first",
                                    " ",
                                    "$name.last"
                                ]
                            },
                            searchFieldValue.trim()
                        ]
                    }
                },
                { 'name.first': { $regex: searchFieldValue.trim(), $options: 'i' } },
                { 'name.last': { $regex: searchFieldValue.trim(), $options: 'i' } }
            ];
            break;

        case 'country':
        case 'city':
        case 'state':
            match[`location.${field}`] = { $regex: searchFieldValue.trim(), $options: 'i' };
            break;

        case 'age':
            match['dob.age'] = searchFieldValue;
            break;

        case 'gender':
        case 'email':
            match[field] = searchFieldValue.trim();
            break;
        default:
            break;
    }
};

/**
 * Function that retrieves a paginated list of users based on the provided query parameters.
 * @param {any} query - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<IResponse>} A promise resolving to the paginated list of users.
 */
export const getAllUsers = async (query: Record<string, any>): Promise<IResponse> => {
    // Dynamic search query
    const match: Record<string, any> = {};
    if (query.search) {
        const searchFields = JSON.parse(query.search);
        for (const field in searchFields) {
            if (searchFields[field]) {
                applySearchField(field, searchFields[field], match);
            }
        }
    }
    // Sorting logic
    const sort: Record<string, any> = {};
    const order: number = query.order === 'desc' ? -1 : 1;
    if (query.sortBy === 'name') {
        sort['name.first'] = order,
        sort['name.last']= order ;
    } else if (query.sortBy === 'country') {
        sort['location.country'] = order 
    } else if (query.sortBy === 'age') {
        sort['dob.age'] = order 
    } else {
        sort['createdAt'] = order;
    }

    // Pagination logic
    const limit: number = Number(query.limit) || 10;
    const page: number = Number(query.page) || 1;
    const skip: number = (page - 1) * limit;
    return await userService.getAllUsers({ match, sort, skip, limit, page });

}
