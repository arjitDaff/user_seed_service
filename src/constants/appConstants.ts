const API_URI: string = 'https://randomuser.me/api/';
const BATCH_SIZE: number = 10;
const REQUEST_INTERVAL: number = 5;
const RESCHEDULE_INTERVAL: number = 15;
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
