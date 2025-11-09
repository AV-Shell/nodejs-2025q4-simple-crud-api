# simple-crud-api
## Task 3

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) 

## Downloading:

```bash
git clone https://github.com/AV-Shell/nodejs-2025q4-simple-crud-api
```

## Open repository folder in terminal,  [depends on your Operation System](https://google.com):

```bash
 cd nodejs-2025q4-simple-crud-api
```

## Change active branch:
```bash
git checkout develop
```


### Install node modules
```
npm install
```


## Running application
```
npm run start
```

## Running application in prodaction mode
```
npm run start:prod
```

## Running application in multi mode
```
npm run start:dev:multi
npm run start:prod:multi

```


## Open second terminal in repository folder

## Run Test:
```bash
npm run test
```

## Application must be runned before run tests
This application is student homework.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT ANY WARRANTY OR CONDITION OF ANY KIND, EXPRESS, IMPLIED OR STATUTORY, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OF ACCURACY, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NONINFRINGEMENT.


- Use 24.10.0 version of Node.js


## Implementation details

1. Implemented endpoint `api/users`:
    - **GET** `api/users` is used to get all persons
        - Server should answer with `status code` **200** and all users records
    - **GET** `api/users/{userId}`
        - Server should answer with `status code` **200** and record with `id === userId` if it exists
        - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with `status code` **404** and corresponding message if record with `id === userId`
          doesn't exist
    - **POST** `api/users` is used to create record about new user and store it in database
        - Server should answer with `status code` **201** and newly created record
        - Server should answer with `status code` **400** and corresponding message if request `body` does not contain *
          *required** fields
    - **PUT** `api/users/{userId}` is used to update existing user
        - Server should answer with `status code` **200** and updated record
        - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with `status code` **404** and corresponding message if record with `id === userId`
          doesn't exist
    - **DELETE** `api/users/{userId}` is used to delete existing user from database
        - Server should answer with `status code` **204** if the record is found and deleted
        - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with `status code` **404** and corresponding message if record with `id === userId`
          doesn't exist
2. Users are stored as `objects` that have following properties:
    - `id` — unique identifier (`string`, `uuid`) generated on server side
    - `username` — user's name (`string`, **required**)
    - `age` — user's age (`number`, **required**)
    - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
3. Requests to non-existing endpoints (e.g. `some-non/existing/resource`) should be handled (server should answer with
   `status code` **404** and corresponding human-friendly message)
4. Errors on the server side that occur during the processing of a request should be handled and processed correctly (
   server should answer with `status code` **500** and corresponding human-friendly message)
5. Value of `port` on which application is running should be stored in `.env` file

- **Important:** The `.env` file itself should not be committed to the repository as it is considered a security bad
  practice. Please consider to add `.env` file in `.gitignore`.

    - Instead, create and commit `.env.example` file that contains a list of required environment variables with
      reasonable default values
    - Example of `.env.example` contents:

      ```
      PORT=4000
      ```

6. There should be 2 modes of running application (**development** and **production**):
    - The application is run in development mode using `nodemon` or `ts-node-dev` (there is a `npm` script `start:dev`)
    - The application is run in production mode (there is a `npm` script `start:prod` that starts the build process and
      then runs the bundled file)
7. There could be some tests for API (not less than **3** scenarios). Example of test scenario:
    1. Get all records with a `GET` `api/users` request (an empty array is expected)
    2. A new object is created by a `POST` `api/users` request (a response containing newly created record is expected)
    3. With a `GET` `api/users/{userId}` request, we try to get the created record by its `id` (the created record is
       expected)
    4. We try to update the created record with a `PUT` `api/users/{userId}`request (a response is expected containing
       an updated object with the same `id`)
    5. With a `DELETE` `api/users/{userId}` request, we delete the created object by `id` (confirmation of successful
       deletion is expected)
    6. With a `GET` `api/users/{userId}` request, we are trying to get a deleted object by `id` (expected answer is that
       there is no such object)
8. There could be implemented horizontal scaling for application, there should be `npm` script `start:multi` that starts
   multiple instances of your application using the Node.js `Cluster` API (equal to the number of available
   parallelism - 1 on the host machine, each listening on port PORT + n) with a **load balancer** that distributes
   requests across them (using Round-robin algorithm). For example: available parallelism is 4, `PORT` is 4000. On run
   `npm run start:multi` it works following way

- On `localhost:4000/api` load balancer is listening for requests
- On `localhost:4001/api`, `localhost:4002/api`, `localhost:4003/api` workers are listening for requests from load
  balancer
- When user sends request to `localhost:4000/api`, load balancer sends this request to `localhost:4001/api`, next user
  request is sent to `localhost:4002/api` and so on.
- After sending request to `localhost:4003/api` load balancer starts from the first worker again (sends request to
  `localhost:4001/api`)
- State of db should be consistent between different workers, for example:
    1. First `POST` request addressed to `localhost:4001/api` creates user
    2. Second `GET` request addressed to `localhost:4002/api` should return created user
    3. Third `DELETE` request addressed to `localhost:4003/api` deletes created user
    4. Fourth `GET` request addressed to `localhost:4001/api` should return **404** status code for created user