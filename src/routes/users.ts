import express, { NextFunction, query } from 'express';
import { Request, Response } from 'express';
import { getAllUsers } from '../controllers/usersController';
import { validate } from '../utils/validator';
import { searchFilterSchema, querySchema } from '../schemas/users';
const router = express.Router();

/**
 * Request handler for fetching a list of users based on query parameters.
 * 
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction middleware.
 */
const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validate(req.query, querySchema);
        if (req.query.search) {
            const search = req.query.search as string;
            validate(JSON.parse(search), searchFilterSchema)
        }
        res.json({
            message: 'User list fetch successfully',
            data: await getAllUsers(req.query)
        });
    } catch (e) {
        next(e);
    }
}

router.get('/',
    getAllUsersHandler
);

export default { router, getAllUsersHandler };
