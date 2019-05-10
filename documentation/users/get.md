
## GET /api/users/all
======
### Returns an array of all users in database, including their hashed passwords

Response body
```
[
    {
        "date": "2000-01-01T00:00:00.000Z",
        "_id": "1234567890abcdefg",
        "username": "test1@test.com",
        "password": "hashedpassword",
        "__v": 0
    },
    {
        "date": "2000-01-01T00:00:00.000Z",
        "_id": "1234567890abcdefg",
        "username": "test2@test.com",
        "password": "hashedpassword",
        "__v": 0
    },
    {
        "date": "2000-01-01T00:00:00.000Z",
        "_id": "1234567890abcdefg",
        "email": "test3@test.com",
        "password": "hashedpassword",
        "__v": 0
    }
]
```
