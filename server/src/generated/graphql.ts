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
  id?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateCreated?: Maybe<Scalars['String']>;
  isLoggedIn?: Maybe<Scalars['Boolean']>;
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

export type AllUsersSuccess = {
   __typename?: 'AllUsersSuccess';
  result: Array<Maybe<User>>;
};

export type AllUsersFailure = {
   __typename?: 'AllUsersFailure';
  message: Scalars['String'];
};

export type AllUsersResult = AllUsersSuccess | AllUsersFailure;

export type NewUserResult = {
   __typename?: 'NewUserResult';
  status: Scalars['Boolean'];
  success?: Maybe<User>;
  failure?: Maybe<UserAlreadyExistsErr>;
};

export type LoginUserResult = {
   __typename?: 'LoginUserResult';
  status: Scalars['Boolean'];
  success?: Maybe<User>;
  failure?: Maybe<UserLoginErr>;
};

export type Passcode = {
   __typename?: 'Passcode';
  secret: Scalars['String'];
  TTL: Scalars['Int'];
};

export type Query = {
   __typename?: 'Query';
  user: UserResult;
  users: AllUsersResult;
  usersWithStatus: AllUsersResult;
  userCanLogIn: UserResult;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersWithStatusArgs = {
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
  username: Scalars['String'];
  email?: Maybe<Scalars['String']>;
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
  AllUsersSuccess: ResolverTypeWrapper<AllUsersSuccess>,
  AllUsersFailure: ResolverTypeWrapper<AllUsersFailure>,
  AllUsersResult: ResolversTypes['AllUsersSuccess'] | ResolversTypes['AllUsersFailure'],
  NewUserResult: ResolverTypeWrapper<NewUserResult>,
  LoginUserResult: ResolverTypeWrapper<LoginUserResult>,
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
  AllUsersSuccess: AllUsersSuccess,
  AllUsersFailure: AllUsersFailure,
  AllUsersResult: ResolversParentTypes['AllUsersSuccess'] | ResolversParentTypes['AllUsersFailure'],
  NewUserResult: NewUserResult,
  LoginUserResult: LoginUserResult,
  Passcode: Passcode,
  Int: Scalars['Int'],
  Query: {},
  Mutation: {},
  CacheControlScope: CacheControlScope,
  Upload: Scalars['Upload'],
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  dateCreated?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  isLoggedIn?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
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

export type AllUsersSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['AllUsersSuccess'] = ResolversParentTypes['AllUsersSuccess']> = {
  result?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AllUsersFailureResolvers<ContextType = any, ParentType extends ResolversParentTypes['AllUsersFailure'] = ResolversParentTypes['AllUsersFailure']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type AllUsersResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AllUsersResult'] = ResolversParentTypes['AllUsersResult']> = {
  __resolveType: TypeResolveFn<'AllUsersSuccess' | 'AllUsersFailure', ParentType, ContextType>
};

export type NewUserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewUserResult'] = ResolversParentTypes['NewUserResult']> = {
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  success?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  failure?: Resolver<Maybe<ResolversTypes['UserAlreadyExistsErr']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type LoginUserResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginUserResult'] = ResolversParentTypes['LoginUserResult']> = {
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  success?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  failure?: Resolver<Maybe<ResolversTypes['UserLoginErr']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type PasscodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Passcode'] = ResolversParentTypes['Passcode']> = {
  secret?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  TTL?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>,
  users?: Resolver<ResolversTypes['AllUsersResult'], ParentType, ContextType>,
  usersWithStatus?: Resolver<ResolversTypes['AllUsersResult'], ParentType, ContextType, RequireFields<QueryUsersWithStatusArgs, 'isLoggedIn'>>,
  userCanLogIn?: Resolver<ResolversTypes['UserResult'], ParentType, ContextType, RequireFields<QueryUserCanLogInArgs, 'id'>>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createNewUSER?: Resolver<Maybe<ResolversTypes['NewUserResult']>, ParentType, ContextType, RequireFields<MutationCreateNewUserArgs, 'username'>>,
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
  AllUsersSuccess?: AllUsersSuccessResolvers<ContextType>,
  AllUsersFailure?: AllUsersFailureResolvers<ContextType>,
  AllUsersResult?: AllUsersResultResolvers,
  NewUserResult?: NewUserResultResolvers<ContextType>,
  LoginUserResult?: LoginUserResultResolvers<ContextType>,
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
