Testing Requirements

All implementations must include thorough testing using Bruno to ensure the quality and reliability of the APIs. The testing requirements are designed to cover all endpoints with both positive and negative scenarios, ensuring comprehensive coverage. Additionally, tests must support automated execution within a CI/CD pipeline by using randomly generated data and maintaining independence from the database state.

General Guidelines



Use Bruno Collections: Tests are organized within a Bruno collection located at Bruno/1DV027API/, categorized based on functionality (Authentication, Readings, Cities, Countries).

Automate with Bruno CLI: The Bruno collection is executed via the bru CLI for integration into the CI/CD pipeline.

Environment Variables: Collection variables manage dynamic data such as JWT tokens and IDs. Sensitive information is not hardcoded in test scripts.

Random Data Generation: Pre-request scripts generate unique and random data for each test run, ensuring tests do not depend on existing database states (e.g., random email and username on every Register run).


Testing for REST APIs


Not applicable — this project implements a GraphQL API.


Testing for GraphQL APIs


Bruno Collection Structure



Total: 22 test cases (exceeds the 20 minimum)


GraphQL Operations Tested:

register
login
readings
reading
cities
city
countries
country
createReading
updateReading
deleteReading




Test Cases Coverage

For each GraphQL operation, the following test cases are implemented:

1. User Authentication Operations



register

Success: Register a new user with a randomly generated email and username (Register.yml).

Failure: Attempt to register with an already existing email (Register Existing Email.yml).



login

Success: Authenticate a user with valid credentials and obtain a JWT token (Login.yml).

Failure: Attempt to login with an incorrect password (Faulty Login.yml).




2. Reading Operations



readings

Success: Fetch a paginated list of readings with limit and offset; verify each reading has expected fields (Readings.yml).

Success: Fetch readings filtered by country (Readings Filtered By Country.yml).

Success: Fetch readings filtered by city (Readings Filtered By City.yml).



reading

Success: Fetch a single reading by ID, including nested city and country (Single Reading.yml).

Failure: Fetch a reading with a non-existent ID — expects NOT_FOUND error (Non Existent Reading.yml).



createReading (Requires authentication)

Success: Create a new reading with valid data and a valid JWT token; stores returned ID for downstream tests (Create Reading Authenticated.yml).

Failure: Attempt to create a reading without a token — expects UNAUTHORIZED error (Create Reading.yml).

Failure: Attempt to create a reading with an invalid/malformed token — expects UNAUTHORIZED error (Create Reading Invalid Token.yml).



updateReading (Requires authentication)

Success: Update an existing reading with valid data and authentication; verify updated fields are reflected (Update Reading.yml).

Failure: Update a reading with a non-existent ID — expects NOT_FOUND error (Update Non Existent Reading.yml).



deleteReading (Requires authentication)

Success: Delete an existing reading with authentication; verify returns true (Delete Reading.yml).

Failure: Delete a reading with a non-existent ID — expects NOT_FOUND error (Delete Non Existent Reading.yml).




3. City and Country Operations



cities

Success: Fetch all cities; verify array is non-empty and each city has required fields (Cities.yml).

Success: Fetch cities filtered by country name (Cities By Country.yml).



city

Success: Fetch a single city by name with nested country; verify nested country name (City With Country.yml).



countries

Success: Fetch all countries; verify array is non-empty and each country has id and name (Countries.yml).

Failure: Fetch a country with a non-existent name — expects NOT_FOUND error (Non Existent Country.yml).



country

Success: Fetch a single country by name with nested cities; verify nested cities array is non-empty (Country With Cities.yml).




Test Case Structure

Each test case within the Bruno collection includes:


Pre-request Scripts or Setup:


Random Data Generation: The Register test uses a before-request script to generate a unique email and username on every run:

  const randomNum = Math.floor(Math.random() * 100000);
  bru.setVar('randomEmail', `testuser${randomNum}@test.com`);
  bru.setVar('randomUsername', `testuser${randomNum}`);


Collection Variables: cityId is stored as a collection variable pointing to a seeded city in the database. JWT tokens are stored dynamically via bru.setVar('token', token) after registration, and are injected into protected mutations via an Authorization header.



Assertions:


Status Codes: All tests verify the HTTP response status is 200 (GraphQL always returns 200; errors are in the response body).

Response Structure: Tests check for the presence of data or errors fields in the GraphQL response.

Data Validation: Tests verify required fields are present, correct types are returned, and error extensions contain the expected code and status values (e.g., NOT_FOUND with status 404, UNAUTHORIZED with status 401).



Sequence Tests:

The test suite is ordered sequentially (using seq numbers in each file):
1. Register → sets token variable
2. Login → verifies token retrieval
3. Create Reading Authenticated → sets readingId variable
4. Single Reading → uses readingId
5. Update Reading → uses readingId
6. Delete Reading → uses readingId

This ensures that the full CRUD lifecycle is exercised within a single run.


Security Considerations:


JWT tokens are stored in collection variables (bru.setVar) and injected via request headers — never hardcoded in query bodies.

Passwords are stored as collection variables in opencollection.yml, which is committed only with non-production test credentials.




Best Practices for CI/CD Integration

Randomized and Independent Data



Avoid Hardcoded Data: User registration uses dynamically generated email and username on every run to prevent duplicate-key conflicts.

Isolation: The create → read → update → delete sequence creates its own reading and cleans it up (via delete) within the same run, leaving no persistent test data.


Test Data Design



Uniqueness: Registration data is randomized per run. The cityId references a seeded city that is stable in the database across runs (read-only reference data).

Validation: Randomly generated data satisfies all API validation requirements (valid email format, non-empty username, valid password length).


Secure Handling of Secrets



Collection Variables: JWT tokens and passwords are stored in Bruno collection variables, not hardcoded in request bodies or query strings.

Git: The .env file (containing MONGODB_URI and JWT_SECRET) is excluded from version control via .gitignore. The opencollection.yml contains only test credentials, not production secrets.


Automated Testing Execution



Bruno CLI Integration: The CI/CD pipeline (GitHub Actions) installs @usebruno/cli and runs:

  cd Bruno/1DV027API && bru run

This executes all 22 tests in sequence on every push and pull request.

Test Reporting: The pipeline reports per-test pass/fail results and fails the build if any test fails.


Submission of Tests



Bruno Collection: Located at Bruno/1DV027API/ in the repository. Run with:

  npm install -g @usebruno/cli
  cd Bruno/1DV027API && bru run


Collection Variables: Defined in Bruno/1DV027API/opencollection.yml. The cityId variable references a stable seeded city. The token variable is populated at runtime by the Register test.

Documentation: See README.md for instructions on running tests locally and how they integrate with the CI/CD pipeline.



Ensure that your Bruno tests are part of the Continuous Integration/Continuous Deployment (CI/CD) pipeline, executing on every commit and pull request to maintain code quality and detect issues early.

Applicability to GraphQL APIs

This project uses a single /graphql endpoint for all queries and mutations, which is handled as follows:


Single Endpoint Handling:

All 22 Bruno tests target https://climate-reading-api.vercel.app/graphql. Different operations are differentiated by the GraphQL query or mutation sent in the request body, not by URL or HTTP method.


Request Payload Structure:

Each Bruno test file sends a GraphQL query or mutation as the request body. Variables are passed separately in the variables field and injected from collection variables at runtime.


Response Validation:

All test assertions check either res.getBody().data (success) or res.getBody().errors (failure). Error assertions also verify res.getBody().errors[0].extensions.code and .extensions.status to ensure consistent error formatting.


Authentication Headers:

Protected mutations (createReading, updateReading, deleteReading) include an Authorization: Bearer {{token}} header, where {{token}} is set dynamically by the Register test at the start of each run.


Dynamic Variables and IDs:

The readingId created by Create Reading Authenticated is stored via bru.setVar('readingId', reading.id) and used in Single Reading, Update Reading, and Delete Reading to chain the full CRUD sequence.


Testing Nested Queries:

Several tests validate nested data structures:
- City With Country: verifies city { country { name } }
- Country With Cities: verifies country { cities { id name } }
- Single Reading: verifies reading { city { country { name } } }
- Readings: verifies reading { city { name } }




Conclusion

The Bruno test suite covers all 22 required test cases, including success and failure scenarios for authentication, CRUD operations on readings, filtering and pagination, nested queries, and error handling. Tests are randomized, sequenced, and integrated into GitHub Actions to run on every push.
