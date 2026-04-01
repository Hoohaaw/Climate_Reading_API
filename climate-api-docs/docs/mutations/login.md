---
sidebar_position: 2
---

# login

Authenticates an existing user and returns a JWT token.

**Authentication required:** No

## Mutation

```graphql
mutation {
  login(
    email: "user@example.com"
    password: "securepassword"
  ) {
    token
  }
}
```

## Arguments

| Argument | Type | Required | Description |
|---|---|---|---|
| email | String! | Yes | Registered email address |
| password | String! | Yes | Account password |

## Example Response

```json
{
  "data": {
    "login": {
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
| UNAUTHORIZED | 401 | Email not found or password is incorrect |
