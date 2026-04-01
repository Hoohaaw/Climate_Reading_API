---
sidebar_position: 6
---

# country

Returns a single country by name, including its nested cities.

**Authentication required:** No

## Query

```graphql
query {
  country(name: "Japan") {
    id
    name
    cities {
      id
      name
      latitude
      longitude
    }
  }
}
```

## Arguments

| Argument | Type | Required | Description |
|---|---|---|---|
| name | String! | Yes | The exact country name |

## Example Response

```json
{
  "data": {
    "country": {
      "id": "64a0003abc...",
      "name": "Japan",
      "cities": [
        {
          "id": "64c0011abc...",
          "name": "Tokyo",
          "latitude": 35.69,
          "longitude": 139.69
        },
        {
          "id": "64c0012abc...",
          "name": "Osaka",
          "latitude": 34.69,
          "longitude": 135.5
        }
      ]
    }
  }
}
```

## Errors

| Code | Status | Reason |
|---|---|---|
| NOT_FOUND | 404 | No country exists with the given name |
