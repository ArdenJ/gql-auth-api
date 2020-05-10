import { User } from "../generated/graphql"

export const sanitizeUserObj = (user):User => {
  const returned = user
  delete returned.password
  return returned
}