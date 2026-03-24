# API Design Assignment

## Project Name

Country Climate API

## Objective

Design and develop a robust, well-documented API (REST or GraphQL) that allows users to retrieve and manage information from a dataset of your choice. The API must include JWT authentication, automated testing via Postman/Newman in a CI/CD pipeline, and be publicly deployed.

Choose a dataset (10000+ data points) that interests you — it should include at least one primary CRUD resource and two additional read-only resources. Sources like [Kaggle](https://www.kaggle.com/datasets), public APIs, or CSV files work well. Pick something you find interesting, as you will reuse this API in the next assignment (WT dashboard).

This is a GraphQL API serving global historical climate data. It exposes monthly average temperature readings for cities across 17 countries, sourced from the Berkeley Earth dataset. Users can query countries, cities, and temperature readings, as well as create, update, and delete readings via authenticated mutations.

## Implementation Type

GraphQL

## Links and Testing

| | URL / File |
|---|---|
| **Production API** | https://climate-reading-api.vercel.app |
| **API Documentation** | https://climate-reading-api.vercel.app/graphql |
| **GraphQL Playground** | https://climate-reading-api.vercel.app/graphql |
| **Bruno Collection** | `Bruno/1DV027API/` |

**Examiner can verify tests in one of the following ways:**

1. **CI/CD pipeline** — check the pipeline output in GitHub Actions for test results.
2. **Run manually** — requires [Bruno CLI](https://www.usebruno.com/) (`npm install -g @usebruno/cli`):
   ```
   cd Bruno/1DV027API && bru run
   ```

## Dataset

| Field | Description |
|---|---|
| **Dataset source** | [Berkeley Earth — Climate Change: Earth Surface Temperature Data (Kaggle)](https://www.kaggle.com/datasets/berkeleyearth/climate-change-earth-surface-temperature-data) |
| **Primary resource (CRUD)** | Readings (id, date, averageTemperature, averageTemperatureUncertainty, city) |
| **Secondary resource 1 (read-only)** | Cities (id, name, latitude, longitude, country) |
| **Secondary resource 2 (read-only)** | Countries (id, name, cities) |

The original dataset contains 8.2 million rows across 3,448 cities and 159 countries. It was filtered to 17 countries: Sweden, Norway, Finland, Denmark, Iceland, Mexico, Puerto Rico, Spain, Italy, Japan, China, Australia, Greece, Canada, Vietnam, Portugal, and Brazil. Rows with missing temperature values are skipped during seeding.

## Design Decisions

### Authentication

JWT (JSON Web Token) authentication is used for all write operations (create, update, delete readings). When a user registers or logs in, the server signs a JWT with a secret key and returns it to the client. The client then includes this token in the `Authorization: Bearer <token>` header on subsequent requests. The server-side middleware extracts and verifies the token on each request, attaching the decoded user to the Apollo Server context. Resolvers for protected mutations call `requireAuth()`, which throws a 401 error if no valid user is present in the context.

Passwords are hashed using bcrypt before storage and compared with bcrypt on login — plain-text passwords are never stored or compared directly.

Alternatives include session-based authentication (server maintains session state) and OAuth (delegates auth to a third party). JWT was chosen because it is stateless (no session storage needed), works well with serverless deployments like Vercel, and is a standard approach for API authentication.

### API Design

The schema is organized around three resource types: `Country`, `City`, and `Reading`. Queries allow fetching all resources or single resources by name/ID, with filtering by city or country name and pagination via `limit` and `offset` on readings. Mutations cover user registration and login, plus full CRUD for readings.

Nested queries are supported in multiple directions:
- `country { cities { readings } }` — traverse from country down to temperature readings
- `city { country }` — resolve a city's parent country
- `reading { city { country } }` — traverse from a reading all the way up

The single `/graphql` endpoint means clients specify exactly what data they need in each request, avoiding over- or under-fetching. Apollo Server's introspection and built-in Playground also serve as live, always-accurate API documentation.

### Error Handling

All errors follow a consistent GraphQL error format with an `extensions` field containing a `code` and `status`:

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

The three error types used are:
- **400 Bad Request** — invalid input, missing required fields, or duplicate registration
- **401 Unauthorized** — missing token, invalid token, or wrong credentials
- **404 Not Found** — requested resource does not exist

GraphQL automatically validates queries against the schema (wrong field names, wrong argument types, etc.), providing an additional layer of error handling for free.

## Core Technologies Used

| Technology | Purpose |
|---|---|
| Node.js + Express | Web server runtime and HTTP handling |
| @apollo/server | GraphQL server, schema validation, and Playground UI |
| graphql | Core GraphQL library |
| mongoose | MongoDB ODM — models, schema validation, queries |
| jsonwebtoken | JWT token creation and verification |
| bcrypt | Secure password hashing |
| dotenv | Local environment variable management |
| csv-parser | Parsing the Berkeley Earth CSV during seeding |
| Vercel | Serverless deployment platform |
| MongoDB Atlas | Cloud-hosted database |

## Reflection

*What was hard? What did you learn? What would you do differently?*

To learn about GraphQL after having to deal with REST was very welcomed. I felt like the learning process, code understanding and quality is easier to achieve with GraphQL. However that does not mean that I dont not appreciate having learnt both GraphQL and REST. But I felt my code is more approachable in this project versus earlier courses. 

Learning about different types of API structures there are clear differences. REST is easier to manage. The archetecture is very straight forward, "This endpoint does this." Which comes with benefits. Easier to maintain, versioning and so on. Whilst GraphQL comes with more flexibility. And in my own experience in this project, which ofcourse is a very small scaled project, it was easier learning GraphQL versus what I remeber it took for me to learn REST. Nontheless, Im happy to have learnt both. 

Also working with large datasets was new. Nothing really new in the sense of I had to think about how to implement it. But I have been wanting to create a application for my own which would be like a dashboard with multiple large datasets displayed. Therefore, this assignment was good practice. 

This project has also yet again proved to me how nice automatic CI/CD pipelines are. We are ofcourse in this course just implementing them on a very small scale. However, with tests running on every push making sure that the code works as intended gives a lot of security. 

## Acknowledgements

Dataset: [Berkeley Earth — Climate Change: Earth Surface Temperature Data](https://www.kaggle.com/datasets/berkeleyearth/climate-change-earth-surface-temperature-data), published on Kaggle.

## Requirements

See [all requirements in Issues](../../issues/). Close issues as you implement them. Create additional issues for any custom functionality. See [TESTING.md](TESTING.md) for detailed testing requirements.

### Functional Requirements — Common

| Requirement | Issue | Status |
|---|---|---|
| Data acquisition — choose and document a dataset (1000+ data points) | [#1](../../issues/1) | :white_check_mark: |
| Full CRUD for primary resource, read-only for secondary resources | [#2](../../issues/2) | :white_check_mark: |
| JWT authentication for write operations | [#3](../../issues/3) | :white_check_mark: |
| Error handling (400, 401, 404 with consistent format) | [#4](../../issues/4) | :white_check_mark: |
| Filtering and pagination for large result sets | [#17](../../issues/17) | :white_check_mark: |

### Functional Requirements — REST

| Requirement | Issue | Status |
|---|---|---|
| RESTful endpoints with proper HTTP methods and status codes | [#12](../../issues/12) | N/A |
| HATEOAS (hypermedia links in responses) | [#13](../../issues/13) | N/A |

### Functional Requirements — GraphQL

| Requirement | Issue | Status |
|---|---|---|
| Queries and mutations via single `/graphql` endpoint | [#14](../../issues/14) | :white_check_mark: |
| At least one nested query | [#15](../../issues/15) | :white_check_mark: |
| GraphQL Playground available | [#16](../../issues/16) | :white_check_mark: |

### Non-Functional Requirements

| Requirement | Issue | Status |
|---|---|---|
| API documentation (Swagger/OpenAPI or Postman) | [#6](../../issues/6) | :white_check_mark: |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7) | :white_check_mark: |
| CI/CD pipeline running tests on every commit/MR | [#8](../../issues/8) | :white_check_mark: |
| Seed script for sample data | [#5](../../issues/5) | :white_check_mark: |
| Code quality (consistent standard, modular, documented) | [#10](../../issues/10) | :white_check_mark: |
| Deployed and publicly accessible | [#9](../../issues/9) | :white_check_mark: |
| Peer review reflection submitted on merge request | [#11](../../issues/11) | :white_large_square: |


