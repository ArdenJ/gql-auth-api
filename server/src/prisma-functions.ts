import { catchAsync } from './utils/errors';
import { PrismaClient } from '@prisma/client'
import { User } from './generated/graphql';

const prisma = new PrismaClient()

const returnUser = (user) => {
  const returned = user
  delete returned.password
  return returned
}

// Query selectors
export const getUsers = async () => await prisma.user.findMany()

export const getUsersByAttr =  async (arg) => await prisma.user.findMany({
  where: arg
})

export const getUserById = async (arg) => await prisma.user.findOne({
  where: {
    id: arg
  }
})

export const getUserByAttr = async (arg) => await prisma.user.findOne({
  where: arg
})

// Mutations 
// FILE ISSUE: providing the generated User type from Apollo conflicts with the user  
// type in prisma. --> I originally used migrate with an Int as the ID --> I changed 
// this to the type is to a string and the type is updated when running "migrate save" 
// again but the referenced Prisma User type here is still the original migration...
export const createUser = async (args) => {
  await prisma.user.create({
    data: {
      ...args
    }
  })

  const USER = await prisma.user.findOne({
    where: {
      username: args.username
    }
  })

  return USER
}

export const toggleUserStatus = async (id, newStatus:boolean) => {
  await prisma.user.update({
  where: {id: id},
  data: {isLoggedIn: newStatus}
})
  return await prisma.user.findOne({
    where: {
      id: id
    }
  })
}

