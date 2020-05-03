import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
};

export type User = {
   __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  dateCreated: Scalars['String'];
  isLoggedIn: Scalars['Boolean'];
};

export type UserNotFoundErr = {
   __typename?: 'UserNotFoundErr';
  message: Scalars['String'];
};

export type UserAlreadyExistsErr = {
   __typename?: 'UserAlreadyExistsErr';
  message: Scalars['String'];
};

export type UserLoginErr = {
   __typename?: 'UserLoginErr';
  message: Scalars['String'];
};

export type UserResult = User | UserNotFoundErr;

export type NewUserResult = User | UserAlreadyExistsErr;

export type LoginUserResult = User | UserLoginErr;

export type Passcode = {
   __typename?: 'Passcode';
  secret: Scalars['String'];
  TTL: Scalars['Int'];
};

export type Query = {
   __typename?: 'Query';
  user: UserResult;
  users: Array<Maybe<User>>;
  loggedInUsers: Array<Maybe<UserResult>>;
  userCanLogIn: UserResult;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryLoggedInUsersArgs = {
  isLoggedIn: Scalars['Boolean'];
};


export type QueryUserCanLogInArgs = {
  id: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createNewUSER?: Maybe<NewUserResult>;
  toggleUSERLogIn: LoginUserResult;
};


export type MutationCreateNewUserArgs = {
  id: Scalars['String'];
  username: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  dateCreated: Scalars['String'];
  isLoggedIn: Scalars['Boolean'];
};


export type MutationToggleUserLogInArgs = {
  secret: Scalars['String'];
  TTL: Scalars['Int'];
  id: Scalars['String'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}




export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  User: ResolverTypeWrapper<User>,
  UserNotFoundErr: ResolverTypeWrapper<UserNotFoundErr>,
  UserAlreadyExistsErr: ResolverTypeWrapper<UserAlreadyExistsErr>,
  UserLoginErr: ResolverTypeWrapper<UserLoginErr>,
  UserResult: ResolversTypes['User'] | ResolversTypes['UserNotFoundErr'],
  NewUserResult: ResolversTypes['User'] | ResolversTypes['UserAlreadyExistsErr'],
  LoginUserResult: ResolversTypes['User'] | ResolversTypes['UserLoginErr'],
  Passcode: ResolverTypeWrapper<Passcode>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Query: ResolverTypeWrapper<{}>,
  Mutation: ResolverTypeWrapper<{}>,
  CacheControlScope: CacheControlScope,
  Upload: ResolverTypeWrapper<Scalars['Upload']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  User: User,
  UserNotFoundErr: UserNotFoundErr,
  UserAlreadyExistsErr: UserAlreadyExistsErr,
  UserLoginErr: UserLoginErr,
  UserResult: ResolversParentTypes['User'] | ResolversParentTypes['UserNotFoundErr'],
  NewUserResult: ResolversParentTypes['User'] | ResolversParentTypes['UserAlreadyExistsErr'],
  LoginUserResult: ResolversParentTypes['User'] | ResolversParentTypes['UserLoginErr'],
  Passcode: Passcode,
  Int: Scalars['Int'],
  Query: {},
  Mutation: {},
  CacheControlScope: CacheControlScope,
  Upload: Scalars['Upload'],
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  dateCreated?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isLoggedIn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserNotFoundErrResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserNotFoundErr'] = ResolversParentTypes['UserNotFoundErr']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserAlreadyExistsErrResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAlreadyExistsErr'] = ResolversParentTypes['UserAlreadyExistsErr']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserLoginErrResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLoginErr'] = ResolversParentTypes['UserLoginErr']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type UserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserResult'] = ResolversParentTypes['UserResult']> = {
  __resolveType: TypeResolveFn<'User' | 'UserNotFoundErr', ParentType, ContextType>
};

export type NewUserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewUserResult'] = ResolversParentTypes['NewUserResult']> = {
  __resolveType: TypeResolveFn<'User' | 'UserAlreadyExistsErr', ParentType, ContextType>
};

export type LoginUserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginUserResult'] = ResolversParentTypes['LoginUserResult']> = {
  __resolveType: TypeResolveFn<'User' | 'UserLoginErr', ParentType, ContextType>
};

export type PasscodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Passcode'] = ResolversParentTypes['Passcode']> = {
  secret?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  TTL?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>,
  users?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>,
  loggedInUsers?: Resolver<Array<Maybe<ResolversTypes['UserResult']>>, ParentType, ContextType, RequireFields<QueryLoggedInUsersArgs, 'isLoggedIn'>>,
  userCanLogIn?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType, RequireFields<QueryUserCanLogInArgs, 'id'>>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createNewUSER?: Resolver<Maybe<ResolversTypes['NewUserResult']>, ParentType, ContextType, RequireFields<MutationCreateNewUserArgs, 'id' | 'username' | 'dateCreated' | 'isLoggedIn'>>,
  toggleUSERLogIn?: Resolver<ResolversTypes['LoginUserResult'], ParentType, ContextType, RequireFields<MutationToggleUserLogInArgs, 'secret' | 'TTL' | 'id'>>,
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type Resolvers<ContextType = any> = {
  User?: UserResolvers<ContextType>,
  UserNotFoundErr?: UserNotFoundErrResolvers<ContextType>,
  UserAlreadyExistsErr?: UserAlreadyExistsErrResolvers<ContextType>,
  UserLoginErr?: UserLoginErrResolvers<ContextType>,
  UserResult?: UserResultResolvers,
  NewUserResult?: NewUserResultResolvers,
  LoginUserResult?: LoginUserResultResolvers,
  Passcode?: PasscodeResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Upload?: GraphQLScalarType,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
