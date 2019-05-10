## GET /api/notes/

**URL** : /api/login/

**Method** : POST

**Auth required** : YES

Data expected format

```
{
    "user": "[ObjectID, type User **required ]",
    "title": "[String min 1 max 100 **required ]",
    "subtitle": "[String min 1 max 200]",
    "content": "[String min 1 max 16384 **required ]",
    "label": ["[String]", ...],
    "public" "[Boolean]"
    "comments": [
        {
            "user": [ObjectID, type User]",
            "comment": "[String]",
            "posted_on": "[UTC Date, automatically added]",
            "likes": "[Number]"
        },
        ...
    ],
    "collaborators": [
        "[ObjectID, type User]"
    ],
    "tags": [
        "[String]"
    ],
    "checklist": {
        "completed": "[Boolean]",
        "items": [
            {
                "completed": "[Boolean]",
                "item": "[String]"
            }
        ]
    },
    "created": "[UTC Date. automatically added]",
    "last_edit": {
        "user": "[ObjectID, type User]",
        "date":  "[UTC Date. automatically added]"
    }
}
```

Data example

Basic note
```
{
    "user": "1ad1a11aa11aa111aaa",
    "title": "Example Note Title",
    "content": "Lorem ipsum dolar",
}
```
Full note
```
{
    "user": "1ad1a11aa11aa111aaa",
    "title": "Example Note Title",
    "subtitle": "Example Note Subtitle",
    "content": "Lorem ipsum dolar lorem ipsum dolar lorem ipsum dolar",
    "label": [ "Urgent", "Project A" ],
    "public" "True"
    "comments": [
        {
            "user": "1ad1a11aa11aa111aaa",
            "comment": "Example comment",
            "posted_on": "2000-01-01T00:00:00.000Z",
            "likes": "12"
        }
    ],
    "collaborators": [
        "1bd1b11bb11bb111bbb"
        "1cd1c11cc11cc111ccc"
    ],
    "tags": [
        "Project A",
        "Project A",
    ],
    "checklist": ""{
        "completed": "false",
        "items": ""[
            {
                "completed": "true",
                "item": "Example checklist item"
            },
            {
                "completed": "false",
                "item": "Example checklist item"
            }
        ]
    },
    "created": "2000-01-01T00:00:00.000Z",
    "last_edit": {
        "user": "1ad1a11aa11aa111aaa",
        "date": "2000-01-01T00:00:00.000Z"
    }
}
```

### Success Response

---

Response body

```
{
    "success": "2x22xx222xxx2222xxxx"
}
```

### Error Response

---

If `title`, `content`, or `user` are not provided
Response body

```
{
    "error": "Missing a field"
}
```

If `user` is incorrect or doesnt exist

```
{
    "error": "User does not exist."
}
```
