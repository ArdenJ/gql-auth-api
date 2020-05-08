# Authentication API on a GQL endpoint wooo 🔥

## Set Up 
Some of this is overkill and can be optimised. 
The API is constructed in three stages: 
  run the docker container -> use prisma migrate to generate models -> start the apollo server 

```
  npm i 
  cd server
  npm i prefix
  npx prisma generate 
  npx prisma migrate save --experimental 
  npx prisma migrate up --experimental -v 
  cd ..
  docker-composer up -d 
  cd server && npm run dev
```

## Wanna Dos 
- things

## Wanna Use
- 🚀  Apollo Server ✅
  - GQL API endpoint
- 🚀  Apollo Client v3 
- 🤤  Codegen ✅
- ✅  Postgres ✅
  - Database
- 🐳  Docker ✅
  - Container for database
- 🔺  Prisma ✅
  - (basically an ORM) for interacting with the database
- ❌  XState
- 🔐  JWT
- 🤐  BCrypt
  - Using BCryptjs rather than installing a billion other dependencies 

Note: This stack is far too much for the scope of this application. 

  