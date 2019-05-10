
## POST /api/notes/
### Adds a note into the database

Data expected format
```
{
    "title": "Note Title",
    "content": "Note Content"
}
```

Response body
```
{
    "success": {
        "_id": "1234567890abcdefg",
        "title": "Note Title",
        "content": "Note Content",
        "user": "1234567890abcdefg",
        "date": "2000-01-01T00:00:00.000Z",
        "__v": 0
    }
}
```
