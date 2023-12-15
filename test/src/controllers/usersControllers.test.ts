import * as userService from '../../../src/services/userService'; 
import {getAllUsers} from '../../../src/controllers/usersController';

describe('UserControllers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('getAllUsers', () => {
        let query: any;
        let result: any;
    
        beforeEach(() => {
            query = {
                sortBy: 'name',
                limit: '5',
                page: '2',
                order: 'asc',
            };
    
            result = {
                total: 1,
                limit: 5,
                page: 2,
                sortBy: 'name',
                items: [
                    {
                        id: '657aa93475e7dc70bcb9c024',
                        gender: 'female',
                        name: 'Madeleine Green',
                        address: {
                            city: 'Lower Hutt',
                            state: 'Canterbury',
                            street: '4854 Victoria Avenue',
                            country: 'New Zealand',
                        },
                        email: 'madeleine.green@example.com',
                        age: '57',
                        picture: 'https://randomuser.me/api/portraits/women/89.jpg',
                        createdAt: '2023-12-14T07:05:24.249Z',
                    },
                ],
            };
    
            jest.spyOn(userService, 'getAllUsersService').mockResolvedValue(result);
        });

        it('should call "getAllUsersService" once with correct parameter', async () => {
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledTimes(1);
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {},
                sort: { 'name.first': 1, 'name.last': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

    
        it('should call "getAllUsersService" with correct parameter if search for name is given', async () => {
            query.search = '{"name":"Madeleine Green"}';
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledTimes(1);
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {
                    $or: [
                        {
                            "$expr": {
                                "$eq":  [
                                    {
                                    "$concat":  [
                                        "$name.first",
                                        " ",
                                        "$name.last",
                                    ],
                                    },
                                    "Madeleine Green",
                                ],
                            },
                        },
                        { 'name.first': { $regex: 'Madeleine Green', $options: 'i' } },
                        { 'name.last': { $regex: 'Madeleine Green', $options: 'i' } },
                    ],
                },
                sort: { 'name.first': 1, 'name.last': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if search for country is given in query parameter', async () => {
            query.search = '{"country":"test"}';
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {"location.country":{ $regex: 'test', $options: 'i' }},
                sort: { 'name.first': 1, 'name.last': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if search for age is given in query parameter', async () => {
            query.search = '{"age":"25"}';
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {"dob.age": "25"},
                sort: { 'name.first': 1, 'name.last': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if search for email is given in query parameter', async () => {
            query.search = '{"email":"abc@example.com"}';
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {"email": "abc@example.com"},
                sort: { 'name.first': 1, 'name.last': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if search for gender is given in query parameter', async () => {
            query.search = '{"gender":"male"}';
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {"gender":{ $eq: 'male'}},
                sort: { 'name.first': 1, 'name.last': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if sortBy is "country"', async () => {
            query.sortBy = 'country';
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {},
                sort: { 'location.country': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if sortBy is "age"', async () => {
            query.sortBy = 'age';
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {},
                sort: { 'dob.age': 1 },
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if sortBy is not given', async () => {
            delete query.sortBy;
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {},
                sort: {"createdAt": 1},
                skip: 5,
                limit: 5,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if limit is not given', async () => {
            delete query.limit;
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {},
                sort: {'name.first': 1, 'name.last': 1 },
                skip: 10,
                limit: 10,
                page: 2,
            });
        });

        it('should call "getAllUsersService" with correct parameter if page is not given', async () => {
            delete query.page;
            await getAllUsers(query);
    
            expect(userService.getAllUsersService).toHaveBeenCalledWith({
                match: {},
                sort: {'name.first': 1, 'name.last': 1 },
                skip: 0,
                limit: 5,
                page: 1,
            });
        });
    
        it('should throw error if "getAllUsersService" throw error', async () => {
            jest.spyOn(userService, 'getAllUsersService').mockRejectedValue(new Error('Some error'));
    
            await expect(() => getAllUsers(query)).rejects.toThrow('Some error');
        });
    });
})
