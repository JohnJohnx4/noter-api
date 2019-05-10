
## PUT /api/users/:id
### Updates the user with the provided data

Data expected format
```
{
    "email": "test@test.com",
    "password": "testing123"
}
```

Response body
```
{
    "user": {
        "date": "2018-08-12T02:49:50.974Z",
        "_id": "5b6fa04e8d019724984bba9c",
        "email": "test@test.com",
        "__v": 0
    }
}
```
