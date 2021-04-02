import { UseGuards } from '@nestjs/common'
import * as GQL from '@nestjs/graphql' //{ Args, Mutation, Query, Resolver, ID }
import mongoose from 'mongoose'

// Guard
import { GqlAuthGuard } from '../../auth/gql-auth.guard'
import { CurrentUser } from '../../auth/currentUser'
import { CheckPolicies, PoliciesGuard } from '../../casl/policy.guard'
import { AppAbility, Action } from '../../casl/casl-ability.factory'

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
  async user(
    @GQL.Args('_id', { type: () => GQL.ID }) _id: mongoose.Types.ObjectId,
  ) {
    return this.service.getById(_id)
  }

  // @CheckPolicies((ability: AppAbility) => {
  //   console.log('[User] [CheckPolicies]', { ability })
  //   return ability.can(Action.Read, User)
  // })

  @GQL.Query(() => [User])
  async users(
    @GQL.Args('filters', { nullable: true }) filters?: ListUserInput,
  ) {
    return this.service.list(filters) //, currentUser)
  }

  @GQL.Mutation(() => User)
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
  @GQL.Query(() => User, { nullable: false })
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    console.log('[User]', { user })
    return user //this.service.getById(user._id)
  }

  // @ResolveField()
  // async calendar(
  //   @Parent() user: UserDocument,
  //   @GQL.Args('populate') populate: boolean,
  // ) {
  //   if (populate) {
  //     await user
  //       .populate({ path: 'calendar', model: Calendar.name })
  //       .execPopulate()
  //   }

  //   return user.calendar
  // }
}

// import { Resolver } from '@nestjs/graphql';
//
// @GQL.Resolver()
// export class UserResolver {}
