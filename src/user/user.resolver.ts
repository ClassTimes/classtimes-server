import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql'
import { Types } from 'mongoose'

// User
import { User } from './user.model'
import { UserService } from './user.service'
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

// Calendar
// import { Calendar } from '../calendar/calendar.model'

@Resolver(() => User)
export class UserResolver {
  constructor(private service: UserService) {}

  @Query(() => User)
  async user(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [User])
  async users(@Args('filters', { nullable: true }) filters?: ListUserInput) {
    return this.service.list(filters)
  }

  @Mutation(() => User)
  async createUser(@Args('payload') payload: CreateUserInput) {
    return this.service.create(payload)
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(@Args('payload') payload: UpdateUserInput) {
    return this.service.update(payload)
  }

  @Mutation(() => User, { nullable: true })
  async deleteUser(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  // @ResolveField()
  // async calendar(
  //   @Parent() user: UserDocument,
  //   @Args('populate') populate: boolean,
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
// @Resolver()
// export class UserResolver {}
