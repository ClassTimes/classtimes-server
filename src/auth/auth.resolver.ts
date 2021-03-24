import {
  Args,
  Mutation,
  // Query,
  Resolver,
  // ID,
  // ResolveField,
  // Parent,
} from '@nestjs/graphql'
// import { Types } from 'mongoose'

// User
// import {
//   Auth,
//   // UserDocument
// } from './user.model'
import {
  User,
  // UserDocument
} from '../user/user.model'
import { AuthService } from './auth.service'
// import { UserService } from './user.service'
import {
  LoginInput,
  // CreateUserInput,
  // ListUserInput,
  // UpdateUserInput,
  // CreateUserInputsSchema,
} from './auth.inputs'

// Calendar
// import { Calendar } from '../calendar/calendar.model'

// () => Auth
@Resolver()
export class AuthResolver {
  constructor(private service: AuthService) {}

  // @Query(() => User)
  // async user(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
  //   return this.service.getById(_id)
  // }

  // @Query(() => [User])
  // async users(@Args('filters', { nullable: true }) filters?: ListUserInput) {
  //   return this.service.list(filters)
  // }

  @Mutation(() => User)
  async loginUser(@Args('payload') payload: LoginInput) {
    // return this.service.create(payload)
    return this.service.login(payload)
  }

  // @Mutation(() => User, { nullable: true })
  // async updateUser(@Args('payload') payload: UpdateUserInput) {
  //   return this.service.update(payload)
  // }

  // @Mutation(() => User, { nullable: true })
  // async deleteUser(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
  //   return this.service.delete(_id)
  // }

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
