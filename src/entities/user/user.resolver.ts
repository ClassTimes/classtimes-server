// import { UseGuards } from '@nestjs/common'
import * as GQL from '@nestjs/graphql' //{ Args, Mutation, Query, Resolver, ID }
import mongoose from 'mongoose'

// Guard
// import { GqlAuthGuard } from '../../auth/gql-auth.guard'
import { CurrentUser } from '../../auth/currentUser'
import { CheckPolicies } from '../../casl/policy.guard'
import { AppAbility, Action } from '../../casl/casl-ability.factory'

// Auth
import { SkipAuth } from '../../auth/decorators'
import { Auth } from '../../auth/auth.model'

// User
import { User } from './user.model'
import { UserService } from './user.service'
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

// Calendar
// import { Calendar } from '../calendar/calendar.model'

@GQL.Resolver(() => User)
export class UserResolver {
  constructor(private service: UserService) {}

  @GQL.Query(() => User)
  @CheckPolicies((a) => a.can(Action.Read, User))
  async user(
    @GQL.Args('_id', { type: () => GQL.ID }) _id: mongoose.Types.ObjectId,
  ) {
    return this.service.getById(_id)
  }

  @GQL.Query(() => [User])
  @CheckPolicies((ability: AppAbility) => {
    // console.log('[User] [CheckPolicies]', { ability })
    return ability.can(Action.Read, User)
  })
  async users(
    @GQL.Args('filters', { nullable: true }) filters?: ListUserInput,
  ) {
    return this.service.list(filters) //, currentUser)
  }

  @GQL.Mutation(() => User)
  @SkipAuth()
  async createUser(@GQL.Args('payload') payload: CreateUserInput) {
    return this.service.create(payload)
  }

  @GQL.Mutation(() => User, { nullable: true })
  async updateUser(@GQL.Args('payload') payload: UpdateUserInput) {
    return this.service.update(payload)
  }

  @GQL.Mutation(() => User, { nullable: true })
  async deleteUser(
    @GQL.Args('_id', { type: () => GQL.ID }) _id: mongoose.Types.ObjectId,
  ) {
    return this.service.delete(_id)
  }

  /**
   * Authenticated
   */

  // @UseGuards(GqlAuthGuard)
  @GQL.Query(() => User, { nullable: false })
  @CheckPolicies((a) => a.can(Action.Read, Auth))
  whoAmI(@CurrentUser() user: User) {
    console.log('[User]', { user })
    return user //this.service.getById(user._id)
  }

  /**
   * Interactions
   */

  @GQL.Mutation(() => User, { nullable: true })
  followSchool(
    @GQL.Args('schoolId', { type: () => GQL.ID })
    schoolId: mongoose.Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    console.log('[School to follow]', schoolId)
    // Steps:
    // 1) Check if school exists. If not, break?
    // 2) Save school to currentUser if logged in ( if(user) )
    // 3) Return something. Wtf do I return?
    return user
    // return school
  }
}
