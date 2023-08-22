# Express TypeScript Application Architecture

This is an overview of the directory structure and components of an Express TypeScript application following the MVC (Model-View-Controller) architecture pattern.

## Directory Structure

- **config**: Contains configuration file for database setup.

- **constants**: Holds constant values that are used consistently throughout the application.

- **controllers**: Contains controller files that handle specific routes and the business logic associated with them.

- **interfaces**: Holds TypeScript interface definitions that define the structure of data objects used in the application, ensuring type safety.

- **middlewares**: Contains middleware functions responsible for processing incoming requests before they reach the route handlers.

- **models**: Contains data model files, which could be Sequelize models or schema definitions for database tables.

- **public**: Holds static assets that can be accessed directly by the client, such as images and stylesheets.

- **routes**: Contains route definitions using Express Router, organizing the API endpoints and routing logic.

- **services**: Contains service files that encapsulate application logic, interact with models.

- **types**: Defines custom type definitions and type-related utilities to enhance type safety in the application.

- **utils**: Contains utility modules and functions used throughout the application, providing reusable functionality.

- **views**: Contains view templates if the application. Use a Pug view engine for rendering dynamic HTML.

- **app.ts**: The main application setup and configuration file where created and configured the Express app, set up middlewares, also server startup file.

## Usage

This architecture promotes a separation of concerns, making codebase more organized and maintainable as application grows. The specific implementation of each component may vary based on project's requirements.

# Launch 

For launching the application you need to make these steps: 

## Create .env file (example described in `.env.example` file)

## Run next commands
- docker build -t image_name .
- docker run --name movies -p 8000:8050 -e APP_PORT=8050 image_name

# Link to image in DockerHub
https://hub.docker.com/r/arthurio222/movies

# Available endpoints: 

- **Users**

*Method*: POST
*Endpoint*: `/api/v1/users`
*Request Body*: JSON object containing valid email, name, password that have more than 7 characters and confirmPassword

- **Sessions**

*Method*: POST
*Endpoint*: `/api/v1/sessions`
*Request Body*: JSON object containing valid email and password that have more than 7 characters

- **Movies**
All movies endpoints must have an authorization header

*Method*: POST
*Endpoint*: `/api/v1/movies`
*Request Body*: JSON object containing valid movie data

*Method*: DELETE
*Endpoint*: `/api/v1/movies`
*Parameter*: `id` (number) - The ID of the movie

*Method*: PATCH
*Endpoint*: `/api/v1/movies`
*Parameter*: `id` (number) - The ID of the movie
*Request Body*: JSON object containing valid movie data

*Method*: GET
*Endpoint*: `/api/v1/movies`
*Query parameters*: 
  `actor` (string, optional) - the name of actor
  `title` (string, optional) - the title of movie
  `search` (string, optional) - example movie_title:actor, the title and actor for searching
  `sort` ("year"/"id"/"title", default "id") - the sort by parameter
  `order` ("ASC"/"DESC", default "ASC") - the sort order
  `limit` (number, optional, default 10) - the response size
  `offset` (number, optional, default 0) - skip elements

*Method*: GET
*Endpoint*: `/api/v1/movies`
*Parameter*: `id` (number) - The ID of the movie

*Method*: POST
*Endpoint*: `/api/v1/movies/import`
*Form data*: key movies, value any text file
