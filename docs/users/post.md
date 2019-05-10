
## POST /api/users/register
### Adds a new user into the database

Data expected format
```
{
    "email": "test1@test.com",
    "password": "testing0"
}
```

Response body
```
{
    "success": {
        "_id": "5b6fc31ebd4b690cdccf9b60",
        "email": "test1@test.com",
        "date": "2018-08-12T05:18:22.726Z",
        "__v": 0
    }
}
```
