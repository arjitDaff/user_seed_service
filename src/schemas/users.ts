import { PATTERN } from '../constants/appConstants';

// Schema rules defined for query parameters
export const querySchema = {
  type: 'object',
  properties: {
    limit: { type: 'string', pattern: PATTERN.STRING_OF_DIGITS_REGEX },
    page: { type: 'string', pattern: PATTERN.STRING_OF_DIGITS_REGEX },
    order: { type: 'string', enum: ['asc', 'desc'] },
    sortBy: { type: 'string', enum: ['name', 'country', 'age', 'createdAt'] },
    search: { type: 'string', format: 'jsonObject' },
  }
}

// Schema rules defined for dynamic search object
export const searchFilterSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', format: 'nonEmptyOrBlank' },
    country: { type: 'string', format: 'nonEmptyOrBlank' },
    city: { type: 'string', format: 'nonEmptyOrBlank' },
    state: { type: 'string', format: 'nonEmptyOrBlank' },
    email: { type: 'string', format: 'nonEmptyOrBlank' },
    age: { type: 'number', pattern: PATTERN.STRING_OF_DIGITS_REGEX },
    gender: { type: 'string', enum: ['male', 'female'] },
  }
};
