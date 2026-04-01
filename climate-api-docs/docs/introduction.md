---
slug: /
sidebar_position: 1
---

# Climate API

A GraphQL API serving global historical temperature data for cities across 17 countries, sourced from the [Berkeley Earth dataset](https://www.kaggle.com/datasets/berkeleyearth/climate-change-earth-surface-temperature-data).

## Base URL

```
https://climate-reading-api.vercel.app/graphql
```

All queries and mutations are sent as POST requests to this single endpoint.

## Resources

| Resource | Type | Description |
|---|---|---|
| Reading | Primary (CRUD) | Monthly average temperature for a city |
| City | Read-only | City with coordinates and country |
| Country | Read-only | Country with list of cities |

## Authentication

Read operations (queries) are public. Write operations (createReading, updateReading, deleteReading) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via the `register` or `login` mutations.
