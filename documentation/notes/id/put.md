
## PUT /api/notes/:id
### Updates a note with the provided ID

Data expected format
```
{
    "changes" : {
        "title": "Note Title",
        "content": "Note Content"
    }
}
```

Response body
```
{
    "updated": {
        "date": "2000-01-01T00:00:00.000Z",
        "_id": "1234567890abcdefg",
        "title": "Note Title",
        "content": "Note Content",
        "user": "1234567890abcdefg",
        "__v": 0
    }
}
```
