
## Login
======

Returns the user's ID and a token

**URL** : /api/login/

**Method** : POST

**Auth required** : NO

Data expected format
```
{
    "email": "[valid email address]",
    "password": "[password in plain text]"
}
```
Data example
```
{
    "email": "test@test.com",
    "password": "qwe123"
}
```
### Success Response
======

Response body
```
{
    "success": {
        "user": "user-id-string",
        "token": "token-string"
    }
}
```
### Error Response
======

If `email` or `password` are not provided
Response body
```
{
    "error": "Email and password are both required."
}
```
If `password` is wrong
```
{
    "error": "The password provided is incorrect."
}
```
If `email` is wrong
```
{
    "error": "The provided user does not exist. Ensure your email is correct."
}
```
