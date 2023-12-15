import { PATTERN } from '../constants/appConstants';

// Schema rules defined for query parameters
export const listUserSchema = {
  type: 'object',
  properties: {
    limit: { type: 'string', pattern: PATTERN.STRING_OF_DIGITS_REGEX },
    skip: { type: 'string', pattern: PATTERN.STRING_OF_DIGITS_REGEX },
    order: { type: 'string', enum: ['asc', 'desc'] },
    sortBy: { type: 'string', enum: ['name', 'country', 'age'] },
    search: { type: 'string', format: 'jsonObject' },
  },
  additionalProperties: true,
}

// Schema rules defined for dynamic search object
export const dynamicSearchFilter = {
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
