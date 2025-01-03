# TODO_RestAPI
A RESTful API built with Node.js and Express to manage tasks. This API supports the basic operations for managing tasks, including creating, fetching, updating, and deleting tasks. It also includes authentication

#Features 
1 . Authentication:
  a. Register a new user.
  b. Login and receive a JWT for authentication. copy and use this token to manage  diffrent api request
2. Task Management:
  a. Create: Add new tasks with a title and optional description.
  b. Retrieve: Fetch all tasks or retrieve a specific task by its ID.
  c. Update: Change the status of tasks (pending, in-progress, completed).
  d. Delete: Remove a task by its ID, and automatically reassign IDs of remaining tasks.
3. Authentication:
  Secured with JWT to ensure that only authorized users can access the API endpoints for managing tasks.
4.Database Connectivity:
  Tasks are stored and managed in a MySQL database with the ability to perform CRUD operations.


#Steps
1. Clone the Repository
    git clone https://github.com/Bhumeshwar2002/TODO_RestAPI
    cd TODO_RESTAPI
2. Install Dependencies
   npm install or
    npm install express mysq12 body-parser jsonwebtoken bcryptjs dotenv
4. Set Up MySQL Database
    a. Log into MySQL:
        mysql -u <username>
    b. Create a database:
        CREATE DATABASE todo_api;
    c. Use the database:
        USE todo_api;
    d. Create the tasks table:
         CREATE TABLE tasks (
         id INT AUTO INCREMENT PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         description TEXT,
         status ENUM( ' pending' , in- progress ',' completed') DEFAULT 'pending');
    e. Create the users table:
         CREATE TABLE users (
         id INT AUTO_INCREMENT PRIMARY KEY,
         username VARCHAR(50) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL);

5. Set Up Environment Variables
     - >  Create .env file in the root directory and copy the secret key provided in ".env.example" file.
     - >  Also include the below details replace data with appropriate field
           DB_HOST=your_database_host
           DB_USER=your_database_user
           DB_PASSWORD=your_database_password
           DB_NAME=your_database_name
   
6. Start the Application
    Node app.js or npm run dev



#API Endpoints
 Authentication
    1. Register
     POST /auth/ register
      Request Body:
        "username": "example",
        "password": "password123"
     • Response:
        "message": "User registered successfully!"
   2. Login
      POST /auth/login
      • Request Body:  
          "username": "example" ,
          "password": "password123"
      • Response:
          "token": "JWT TOKEN>" 
          copy this JWT TOKEN

   3. Task Management (Secured)
     a. Create a Task
        POST /tasks
          • Headers:
              Authorization: Bearer <JWT TOKEN>
           Request Body.
              "title": "first Task",
              "description": "This is first  task. "
      b. Fetch All Tasks
            GET /tasks
              • Headers:
                Authorization : Bearer <JWT TOKEN>
      c. Fetch a Task by ID
            GET / tasks/ : id
              Headers:
                Authorization: Bearer <JWT TOKEN>
      d. Update Task Status
            PUT /tasks/ : id
              • Headers:
                  Authorization: Bearer <JWT TOKEN>
                Request Body.
                  "status" : "completed"
      e. Delete a Task
            DELETE /tasks/:id
                • Headers:
                    Authorization: Bearer <JWT TOKEN>
