---
sidebar_position: 3
---

# Authentication

Write operations — `createReading`, `updateReading`, and `deleteReading` — require a valid JWT token. Read operations (all queries) are public.

## Getting a Token

Register a new account or log in with an existing one:

```graphql
mutation {
  login(email: "user@example.com", password: "yourpassword") {
    token
  }
}
```

The response returns a token that expires after **7 days**.

## Using the Token

Include the token in the `Authorization` header of every protected request:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Responses

If the token is missing or invalid, the API returns:

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHORIZED",
        "status": 401
      }
    }
  ]
}
```
