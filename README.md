# Project Name
User seed service 

## Overview
Application aims to seed the randomly generated users from an [external api](https://randomuser.me/api) that schedules a job in regular interval. This project also provided an api to fetch the paginated list of users saved in database.


## Prerequisites

1. Docker installed locally
2. Mongodb database

## Environment Variables
1. PORT - `Port on which the server will run`
2. MONGODB_URI - `Database connection string.`
 `mongodb+srv://<username>:<password>@<host>/<database_name>?retryWrites=true&w=majority`

3. API_URI - `API to fetch random users`
4. BATCH_SIZE - `Number of users to fetch in single batch`
5. REQUEST_INTERVAL - `Interval between two requests to fetch users(in seconds)`
6. RESCHEDULE_INTERVAL - `Time interval after which the scheduler will run again (in case previous request fails, in seconds)`

## Start Application

1. Set the mongodb connection string in the .env file parameter (MONGODB_URI)
2. Open terminal from the root folder and execute the command to build application image locally: 
`docker build -t user_seed_service .`

3. Run command to start the application: `docker compose up`
4. The application would be up and running on the specified port. 
`http://localhost:3000`

## Logs
1. Application logs can be seen in ./logs/server.log

## Unit Test
Test are written using [Jest framework](https://jestjs.io/)
1. To run unit tests execute command `npm run test`
2. Open `./coverage/index.html` file to check coverage

## Paginated User List

### Request 

#####  URL - `/api/users`

#####  HTTP Method - `GET`

#####  Query Parameters- 
The following query parameters can be used to customize the request:

######  `search`
 Used to filter users based on specific criteria. Accepts a JSON object with the following fields:
- `name` (string)
- `country` (string)
- `city` (string)
- `state` (string)
- `gender` (string)
- `age` (number)

######  `limit`
Used for pagination to limit the number of users. Accepts a positive numeric value.

###### `sortBy`
Used to sort the list. Accepts the following values:
- `name`
- `country`
- `age`
- `createdAt`

By default, the list is sorted by `createdAt`.

###### `order`
Determines the order of sorting. Accepts values:
- `asc`
- `desc`

###### `page`
Used to skip users

**Example Usage:**
```plaintext
/api/users?search={"name": "John", "country": "USA"}&limit=10&sortBy=age&order=desc&page=2
```

### Response 

```json
{
    "message": "User list fetch successfully",
    "data": {
        "total": 353,
        "limit": 1,
        "page": 1,
        "sortBy": "",
        "items": [
            {
                "id": "657c11187474580a8335ebc6",
                "gender": "male",
                "name": "Aadi Jain",
                "address": {
                    "city": "Kumbakonam",
                    "state": "Bihar",
                    "street": "9611 Camac St",
                    "country": "India"
                },
                "email": "aadi.jain@example.com",
                "age": "25",
                "picture": "https://randomuser.me/api/portraits/men/93.jpg",
                "createdAt": "2023-12-15T08:40:56.010Z"
            }
        ]
    }
}
```

