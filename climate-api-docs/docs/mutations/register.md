---
sidebar_position: 1
---

# register

Creates a new user account and returns a JWT token.

**Authentication required:** No

## Mutation

```graphql
mutation {
  register(
    email: "user@example.com"
    username: "myusername"
    password: "securepassword"
  ) {
    token
  }
}
```

## Arguments

| Argument | Type | Required | Description |
|---|---|---|---|
| email | String! | Yes | Unique email address |
| username | String! | Yes | Unique username |
| password | String! | Yes | Plain-text password (hashed before storage) |

## Example Response

```json
{
  "data": {
    "register": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

The token expires after **7 days**. Use it in the `Authorization` header for protected mutations:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Errors

| Code | Status | Reason |
|---|---|---|
| BAD_REQUEST | 400 | Email is already registered |
