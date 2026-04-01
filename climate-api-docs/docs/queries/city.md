---
sidebar_position: 4
---

# city

Returns a single city by name, including its nested country and optionally its temperature readings.

**Authentication required:** No

## Query

```graphql
query {
  city(name: "Stockholm") {
    id
    name
    latitude
    longitude
    country {
      name
    }
    readings {
      id
      date
      averageTemperature
    }
  }
}
```

## Arguments

| Argument | Type | Required | Description |
|---|---|---|---|
| name | String! | Yes | The exact city name |

## Example Response

```json
{
  "data": {
    "city": {
      "id": "64c5678def...",
      "name": "Stockholm",
      "latitude": 59.33,
      "longitude": 18.05,
      "country": {
        "name": "Sweden"
      },
      "readings": [
        {
          "id": "64b1234abc...",
          "date": "1719792000000",
          "averageTemperature": 18.4
        }
      ]
    }
  }
}
```

:::tip
Omit the `readings` field if you only need city metadata — fetching all readings for a city can return a large number of results.
:::

## Errors

| Code | Status | Reason |
|---|---|---|
| NOT_FOUND | 404 | No city exists with the given name |
