# Migration `20200508133840-users-2`

This migration has been generated by ArdenJ at 5/8/2020, 1:38:41 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP TABLE "public"."User";

CREATE TABLE "public"."User" (
"dateCreated" timestamp(3)  NOT NULL ,"email" text   ,"id" text  NOT NULL ,"isLoggedIn" boolean  NOT NULL DEFAULT false,"username" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "User.username" ON "public"."User"("username")

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200508112241-users..20200508133840-users-2
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = "postgresql://admin:secret@localhost:5432/gql-auth?schema=public"
 }
 // this will automaically target the node modules 
 // folder to generate the client and the native 
@@ -13,9 +13,9 @@
   provider = "prisma-client-js"
 }
 model User {
-  id Int @id 
+  id String @id 
   username String @unique
   email String? @unique
   dateCreated DateTime 
   isLoggedIn Boolean @default(false)
```

