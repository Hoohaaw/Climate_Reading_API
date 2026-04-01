---
sidebar_position: 3
---

# cities

Returns a list of all cities. Optionally filter by country name.

**Authentication required:** No

## Query

```graphql
query {
  cities(country: "Sweden") {
    id
    name
    latitude
    longitude
    country {
      name
    }
  }
}
```

## Arguments

| Argument | Type | Required | Description |
|---|---|---|---|
| country | String | No | Filter cities by country name |

## Example Response

```json
{
  "data": {
    "cities": [
      {
        "id": "64c5678def...",
        "name": "Stockholm",
        "latitude": 59.33,
        "longitude": 18.05,
        "country": {
          "name": "Sweden"
        }
      },
      {
        "id": "64c5678abc...",
        "name": "Gothenburg",
        "latitude": 57.71,
        "longitude": 11.97,
        "country": {
          "name": "Sweden"
        }
      }
    ]
  }
}
```

## Errors

| Code | Status | Reason |
|---|---|---|
| NOT_FOUND | 404 | The specified `country` filter does not exist |
