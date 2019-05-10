# noter-api
### API for creating, reading, updating, and deleting notes. All routes are protected, requiring a JWT on the Authorization header, except for the login route

## Running Locally
---
- Fork and clone repo to your local machine
- run `npm install`
- run `npm run dev` to have nodemon run the server
- run `npm start` to start the server

Check out the docs for information on the server and its endpoints:


### Login endpoints
---
* [Login](docs/login.md) : `POST /api/login/`

Requires an API key to login. You can store your own API key in a `.env` file under `PUBLIC_KEY`.
Other `.env` variables you will need are 
```
SALT_ROUNDS: Number for hashing passwords, 
PORT: Port to host server, defaults to 5000, 
SECRET_KEY: String holding key for securing JWT, 
PUBLIC_KEY: Key to secure login route
```

### User endpoints
---
Endpoints for viewing and manipulating Users
* [Add a new User](docs/users/post.md) : `[POST] /api/users/`
* [Get all Users](docs/users/get.md) : `[GET] /api/users/`
* [Get single User](docs/users/id/get.md) : `[POST] /api/users/:id`
* [Update a User](docs/users/id/put.md) : `[POST] /api/users/:id`
* [Delete a User](docs/users/id/delete.md) : `[POST] /api/users/:id`

### Note endpoints
---
Endpoints for viewing and manipulating Notes
* [Get all Notes](docs/notes/post.md) : `[POST] /api/notes/`
* [Get all Notes](docs/notes/get.md) : `[GET] /api/notes/`
* [Get single Note](docs/notes/id/get.md) : `[POST] /api/notes/:id`
* [Update a Note](docs/notes/id/put.md) : `[POST] /api/notes/:id`
* [Delete a Note](docs/notes/id/delete.md) : `[POST] /api/notes/:id`
