---
sidebar_position: 5
---

# deleteReading

Deletes a temperature reading by ID. Returns `true` on success.

**Authentication required:** Yes — include `Authorization: Bearer <token>` in the request header.

## Mutation

```graphql
mutation {
  deleteReading(id: "64b9999xyz...")
}
```

## Arguments

| Argument | Type | Required | Description |
|---|---|---|---|
| id | ID! | Yes | ID of the reading to delete |

## Example Response

```json
{
  "data": {
    "deleteReading": true
  }
}
```

## Errors

| Code | Status | Reason |
|---|---|---|
| UNAUTHORIZED | 401 | Missing or invalid JWT token |
| NOT_FOUND | 404 | No reading exists with the given ID |
