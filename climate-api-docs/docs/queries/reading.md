---
sidebar_position: 2
---

# reading

Returns a single temperature reading by its ID, including nested city and country.

**Authentication required:** No

## Query

```graphql
query {
  reading(id: "64b1234abc...") {
    id
    date
    averageTemperature
    averageTemperatureUncertainty
    city {
      name
      latitude
      longitude
      country {
        name
      }
    }
  }
}
```

## Arguments

| Argument | Type | Required | Description |
|---|---|---|---|
| id | ID! | Yes | The ID of the reading |

## Example Response

```json
{
  "data": {
    "reading": {
      "id": "64b1234abc...",
      "date": "1719792000000",
      "averageTemperature": 18.4,
      "averageTemperatureUncertainty": 0.3,
      "city": {
        "name": "Stockholm",
        "latitude": 59.33,
        "longitude": 18.05,
        "country": {
          "name": "Sweden"
        }
      }
    }
  }
}
```

:::note
The `date` field is returned as a Unix timestamp in milliseconds. Convert with `new Date(parseInt(date))`.
:::

## Errors

| Code | Status | Reason |
|---|---|---|
| NOT_FOUND | 404 | No reading exists with the given ID |
