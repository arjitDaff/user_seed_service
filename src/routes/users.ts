import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { getAllUsers } from '../controllers/users';
import logger from '../utils/logger';
import { validate } from '../utils/validator';
import { dynamicSearchFilter, listUserSchema } from '../schemas/users';
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
        logger.info(`List all users request with query: ${JSON.stringify(req.query)}`);
        validate(req.query, listUserSchema);
        if (req.query.search) {
            const search = req.query.search as string;
            validate(JSON.parse(search), dynamicSearchFilter)
        }
        res.json({
            message: 'User list fetch successfully',
            data: await getAllUsers(req.query)
        });
    } catch(e) {
        next(e);
    }
}

router.get('/', 
    getAllUsersHandler
);

export default {router, getAllUsersHandler};
