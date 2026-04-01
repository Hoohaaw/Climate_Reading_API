---
sidebar_position: 4
---

# updateReading

Updates an existing temperature reading by ID.

**Authentication required:** Yes — include `Authorization: Bearer <token>` in the request header.

## Mutation

```graphql
mutation {
  updateReading(
    id: "64b9999xyz..."
    input: {
      date: "2024-06-01"
      averageTemperature: 22.0
      averageTemperatureUncertainty: 0.2
      cityId: "64c5678def..."
    }
  ) {
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

| Argument | Type | Required | Description |
|---|---|---|---|
| id | ID! | Yes | ID of the reading to update |
| input | ReadingInput! | Yes | New values for the reading |

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
    "updateReading": {
      "id": "64b9999xyz...",
      "date": "1717200000000",
      "averageTemperature": 22.0,
      "averageTemperatureUncertainty": 0.2,
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
| NOT_FOUND | 404 | No reading exists with the given ID |
| NOT_FOUND | 404 | No city exists with the given `cityId` |
