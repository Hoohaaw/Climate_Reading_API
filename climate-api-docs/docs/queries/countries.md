---
sidebar_position: 5
---

# countries

Returns all countries in the dataset.

**Authentication required:** No

## Query

```graphql
query {
  countries {
    id
    name
  }
}
```

## Example Response

```json
{
  "data": {
    "countries": [
      { "id": "64a0001abc...", "name": "Sweden" },
      { "id": "64a0002abc...", "name": "Norway" },
      { "id": "64a0003abc...", "name": "Japan" }
    ]
  }
}
```

The dataset includes 17 countries: Sweden, Norway, Finland, Denmark, Iceland, Mexico, Puerto Rico, Spain, Italy, Japan, China, Australia, Greece, Canada, Vietnam, Portugal, and Brazil.

## Errors

None — always returns the full list.
