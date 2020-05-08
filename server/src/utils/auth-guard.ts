export const authenticated = next => (root, args, ctx, info) => {

  if (!ctx.authenticate(ctx.req).currentUser) {
    throw new Error('Unauthenticated!! 😠')
  }

  return next(root, args, ctx, info)
}