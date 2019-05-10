
## GET /api/notes/
### Returns an array of all notes in database

Response body
```
{
    "success": [
        {
            "date": "2000-01-01T00:00:00.000Z",
            "_id": "1234567890abcdefg",
            "title": "Note Title",
            "content": "Note Content",
            "user": {
                "_id": "1234567890abcdefg",
                "email": "test@test.com"
            },
            "__v": 0
        },
        {
            "date": "2000-01-01T00:00:00.000Z",
            "_id": "1234567890abcdefg",
            "title": "Note Title",
            "content": "Note Content",
            "user": {
                "_id": "1234567890abcdefg",
                "email": "test@test.com"
            },
            "__v": 0
        },
        {
            "date": "2000-01-01T00:00:00.000Z",
            "_id": "1234567890abcdefg",
            "title": "Note Title",
            "content": "Note Content",
            "user": {
                "_id": "1234567890abcdefg",
                "email": "test@test.com"
            },
            "__v": 0
        },
    ]
}
```
