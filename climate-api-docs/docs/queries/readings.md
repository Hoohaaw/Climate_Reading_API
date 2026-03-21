readings# Readings

Returns a list of readings with optional filters and pagination.

**Authentication required:** No

## Query
​```graphql
query {
  readings(limit: 10, offset: 0) {
    id
    date
    averageTemperature
  }
}
​```

## Arguments
| Argument | Type | Required | Description |
|---|---|---|---|
| city | String | No | Filter by city name |
| country | String | No | Filter by country name |
| limit | Int | No | Default 100 |
| offset | Int | No | Default 0 |

## Example Response
​```json
{
  "data": {
    "readings": [...]
  }
}
​```

## Errors
None — returns empty array if no results found.