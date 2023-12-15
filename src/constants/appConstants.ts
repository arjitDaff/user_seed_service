const API_URI: string = process.env.API_URI || 'https://randomuser.me/api/';
const BATCH_SIZE: number = Number(process.env.BATCH_SIZE) || 10;
const REQUEST_INTERVAL: number = Number(process.env.REQUEST_INTERVAL) || 5;
const RESCHEDULE_INTERVAL: number = Number(process.env.RESCHEDULE_INTERVAL) || 15;
const PATTERN: Record<string, string | RegExp> = {
    STRING_OF_DIGITS_REGEX: '^[0-9]+$',
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

export {
    API_URI,
    BATCH_SIZE,
    REQUEST_INTERVAL,
    RESCHEDULE_INTERVAL,
    PATTERN
}