
export const catchAsync = handler => (...args) => handler(...args).catch(args[2])
