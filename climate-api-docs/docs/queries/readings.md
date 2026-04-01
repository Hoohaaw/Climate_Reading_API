---
sidebar_position: 1
---

# readings

Returns a list of temperature readings. Supports filtering by city or country name, and pagination via `limit` and `offset`.

**Authentication required:** No

## Query

```graphql
query {
  readings(city: "Stockholm", limit: 5, offset: 0) {
    id
    date
    averageTemperature
    averageTemperatureUncertainty
    city {
      name
    }
  }
}
```

## Arguments

| Argument | Type | Required | Default | Description |
|---|---|---|---|---|
| city | String | No | — | Filter by city name |
| country | String | No | — | Filter by country name |
| limit | Int | No | 100 | Max number of results |
| offset | Int | No | 0 | Number of results to skip |

## Example Response

```json
{
  "data": {
    "readings": [
      {
        "id": "64b1234abc...",
        "date": "1719792000000",
        "averageTemperature": 18.4,
        "averageTemperatureUncertainty": 0.3,
        "city": {
          "name": "Stockholm"
        }
      }
    ]
  }
}
```

:::note
The `date` field is returned as a Unix timestamp in milliseconds. Convert with `new Date(parseInt(date))`.
:::

## Errors

| Code | Status | Reason |
|---|---|---|
| NOT_FOUND | 404 | The specified `city` or `country` filter does not exist |
