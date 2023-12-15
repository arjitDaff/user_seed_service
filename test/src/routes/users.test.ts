// users.test.ts
import { Request, Response, NextFunction } from 'express';
import userRoutes from '../../../src/routes/users';
import * as usersController from '../../../src/controllers/usersController';
import {validate} from '../../../src/utils/validator';
import {querySchema, searchFilterSchema} from '../../../src/schemas/users';

jest.mock('../../../src/utils/validator', () => {
    return {
        validate: jest.fn(),
    };
});

describe('getAllUsersHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    })
    let res = {json: jest.fn()} as unknown as Response;  
    let next: jest.Mock<NextFunction>;
    const response = {
        "total": 974,
        "limit": 20,
        "page": 1,
        "sortBy": "",
        "items": [
            { "id": "657aa93475e7dc70bcb9c024",
            "gender": "female",
            "name": "Madeleine Green",
            "address": {
                "city": "Lower Hutt",
                "state": "Canterbury",
                "street": "4854 Victoria Avenue",
                "country": "New Zealand"
            },
            "email": "madeleine.green@example.com",
            "age": "57",
            "picture": "https://randomuser.me/api/portraits/women/89.jpg",
            "createdAt": "2023-12-14T07:05:24.249Z"
        }]
    };

    let req: Record<string, any> = {};

    beforeEach(() => {
        req['query'] = {
            search: '{"name":"Madeleine"}',
            sortBy: 'name',
        }
        next = jest.fn();
        jest.spyOn(usersController, 'getAllUsers').mockResolvedValue(JSON.parse(JSON.stringify(response)));        
    }); 

    it('should call "validate" twice with correct parameter', async () => {
        await userRoutes.getAllUsersHandler(req as Request, res as Response, next);

        expect(validate).toHaveBeenCalledTimes(2);
        expect(validate).toHaveBeenNthCalledWith(1, req.query, querySchema);
        expect(validate).toHaveBeenNthCalledWith(2, JSON.parse(req.query.search), searchFilterSchema);
    });

    it('should call "validate" once if search parameter is received', async () => {
        delete req.query.search;
        await userRoutes.getAllUsersHandler(req as Request, res as Response, next);

        expect(validate).toHaveBeenCalledTimes(1);
        expect(validate).toHaveBeenCalledWith(req.query, querySchema);
    });

    it ('should call getAllUsers once with correct parameter', async () => {
        await userRoutes.getAllUsersHandler(req as Request, res as Response, next);

        expect(usersController.getAllUsers).toHaveBeenCalledTimes(1);
        expect(usersController.getAllUsers).toHaveBeenCalledWith(req.query);
    });

    it('should handle fetching users successfully', async () => {
        // Mock the getAllUsers function to return some data

        await userRoutes.getAllUsersHandler(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User list fetch successfully',
            data: response,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should throw error if "getAllUsers" throw error', async () => {
        // Mock the getAllUsers function to throw an error
        jest.spyOn(usersController, 'getAllUsers').mockRejectedValue(new Error('Some error'));

        await userRoutes.getAllUsersHandler(req as Request, res as Response, next);

        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
