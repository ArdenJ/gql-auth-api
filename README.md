# Auth API on a GQL endpoint 🔐🤐

The idea of this project is to build an authentication / authorization gql api that 
handles secrets (relatively) securely. This project is an opportunity to really focus 
on handling data, validation / sanitisation, error handling and being aware of basic 
security concerns. 

The API is strongly typed using TypeScript and generated types from the GraphQL Schema. 
The Schema itself is highly opinionated in an effort to limit the number of states that 
can be returned to the client. Passwords are hashed and encrypted (using crypto and 
BCryptjs) and are not in plaintext anywhere in the application. Requests to restricted 
queries are authenticated against a user's token.

[**Demo video**](https://drive.google.com/file/d/1zOqEtA6WHoQzJJETmJy3nmZ7ob0oqy9u/preview) showing a basic user route of creating, authenticating login and deleting an account. 

## Quick Start API: 
Note: this needs to be optimised!

install dependencies in the root and /server 

run the docker container from the root of the project
```
  docker-composer up -d 
```
run the following on the server:
```
  npx prisma generate 
  npx prisma migrate save --experimental 
  npx prisma migrate up --experimental -v 
  npm run dev
```

## To Dos 
- Sanitise message responses: 
  - Error messages returned to the client can potentially give away details about what is/isn't on the database
- Add Role to user model/type
  - API queries should follow principal of least privilege
- Remove hardcoded 'secrets'
- Move config variables to their own folder
- implement 'too many requests' 429 response server-side
- abstract try catch on resolvers to wrapper function
- Add check that the User is logged in in order to delete account 
- deleting an account should result in a real response *not* an unhandled type error
- Add more descriptive errors to CreateUser mutation: remove UserAlreadyExists placeholder
- Add a simple client

## Using
Note: Frankly, the below is overkill for the scope of this application. 

- 🚀  Apollo Server 
  - GQL API endpoint
- 🚀  Apollo Client v3 
  - Declarative data-fetching from the API
- 🤤  Codegen 
  - Types are generated using the gql schema. 
- ✅  Postgres 
  - Overkill database for storing user data
- 🐳  Docker 
  - Container for database
- 🔺  Prisma 
  - (somewhere between an ORM and query builder) for interacting with the database
- ❌  XState
  - Manage client side state and prevent too many failed requests being made to the server
- 🔐  JWT 
  - Authenticating requests made to api
- 🤐  BCrypt 
  - Only hashed and encrypted passwords are stored on the database

