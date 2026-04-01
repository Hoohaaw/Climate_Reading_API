---
sidebar_position: 3
---

# createReading

Creates a new temperature reading for a city.

**Authentication required:** Yes — include `Authorization: Bearer <token>` in the request header.

## Mutation

```graphql
mutation {
  createReading(input: {
    date: "2024-06-01"
    averageTemperature: 18.5
    averageTemperatureUncertainty: 0.3
    cityId: "64c5678def..."
  }) {
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

## Input Fields (ReadingInput)

| Field | Type | Required | Description |
|---|---|---|---|
| date | String! | Yes | Date in ISO 8601 format (e.g. `2024-06-01`) |
| averageTemperature | Float | No | Average temperature in Celsius |
| averageTemperatureUncertainty | Float | No | Measurement uncertainty value |
| cityId | ID! | Yes | ID of the city this reading belongs to |

## Example Response

```json
{
  "data": {
    "createReading": {
      "id": "64b9999xyz...",
      "date": "1717200000000",
      "averageTemperature": 18.5,
      "averageTemperatureUncertainty": 0.3,
      "city": {
        "name": "Stockholm"
      }
    }
  }
}
```

## Errors

| Code | Status | Reason |
|---|---|---|
| UNAUTHORIZED | 401 | Missing or invalid JWT token |
| NOT_FOUND | 404 | No city exists with the given `cityId` |
