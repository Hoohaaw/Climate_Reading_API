---
sidebar_position: 2
---

# Getting Started

## Base URL

All requests go to a single GraphQL endpoint:

```
https://climate-reading-api.vercel.app/graphql
```

## Making a Request

Send a `POST` request with a JSON body containing your `query` or `mutation`:

```bash
curl -X POST https://climate-reading-api.vercel.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ countries { id name } }"}'
```

## GraphQL Playground

Open the base URL in your browser to access the interactive GraphQL Playground, where you can explore the schema and run queries without any setup.

## Example: Fetch Readings for a Country

```graphql
query {
  readings(country: "Sweden", limit: 10) {
    date
    averageTemperature
    city {
      name
    }
  }
}
```

## Example: Full CRUD Flow

```graphql
# 1. Register
mutation {
  register(email: "user@example.com", username: "myuser", password: "pass1234") {
    token
  }
}

# 2. Create a reading (use the token from step 1 in Authorization header)
mutation {
  createReading(input: {
    date: "2024-06-01"
    averageTemperature: 20.5
    cityId: "your-city-id-here"
  }) {
    id
    date
    averageTemperature
  }
}

# 3. Update it
mutation {
  updateReading(id: "reading-id-here", input: {
    date: "2024-06-01"
    averageTemperature: 21.0
    cityId: "your-city-id-here"
  }) {
    id
    averageTemperature
  }
}

# 4. Delete it
mutation {
  deleteReading(id: "reading-id-here")
}
```

## Error Format

All errors follow a consistent structure:

```json
{
  "errors": [
    {
      "message": "Reading not found",
      "extensions": {
        "code": "NOT_FOUND",
        "status": 404
      }
    }
  ]
}
```

| Code | Status | Meaning |
|---|---|---|
| NOT_FOUND | 404 | Resource does not exist |
| UNAUTHORIZED | 401 | Missing or invalid JWT token |
| BAD_REQUEST | 400 | Invalid input (e.g. duplicate email) |
