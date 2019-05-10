# noter-api
### API for creating, reading, updating, and deleting notes. All routes are protected, requiring a JWT on the Authorization header, except for the login route

* [Login](documentation/login.md) : `POST /api/login/`

### User endpoints
---
Endpoints for viewing and manipulating Users
* [Add a new User](documentation/users/post.md) : `[POST] /api/users/`
* [Get all Users](documentation/users/get.md) : `[GET] /api/users/`
* [Get single User](documentation/users/id/get.md) : `[POST] /api/users/:id`
* [Update a User](documentation/users/id/put.md) : `[POST] /api/users/:id`
* [Delete a User](documentation/users/id/delete.md) : `[POST] /api/users/:id`

### Note endpoints
---
Endpoints for viewing and manipulating Notes
* [Get all Notes](documentation/notes/post.md) : `[POST] /api/notes/`
* [Get all Notes](documentation/notes/get.md) : `[GET] /api/notes/`
* [Get single Note](documentation/notes/id/get.md) : `[POST] /api/notes/:id`
* [Update a Note](documentation/notes/id/put.md) : `[POST] /api/notes/:id`
* [Delete a Note](documentation/notes/id/delete.md) : `[POST] /api/notes/:id`
