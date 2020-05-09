# Auth API on a GQL endpoint wooo 🔥

The idea of this project is to build an authentication / authorization gql api that 
handles secrets (relatively) securely. This project is an opportunity to really focus 
on handling data, validation / sanitisation, error handling and being aware of basic 
security concerns. 

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
- so so many 

## Using
Note: Frankly, the below is overkill for the scope of this application. 

- 🚀  Apollo Server ✅
  - GQL API endpoint
- 🚀  Apollo Client v3 
- 🤤  Codegen ✅
- ✅  Postgres ✅
  - Database
- 🐳  Docker ✅
  - Container for database
- 🔺  Prisma ✅
  - (somewhere between an ORM and query builder) for interacting with the database
- ❌  XState
- 🔐  JWT
- 🤐  BCrypt
  - Using BCryptjs rather than installing a billion other dependencies 
