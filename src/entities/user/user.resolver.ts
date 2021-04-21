// import { UseGuards } from '@nestjs/common'
import * as GQL from '@nestjs/graphql' //{ Args, Mutation, Query, Resolver, ID }
import mongoose from 'mongoose'

// Guard
// import { GqlAuthGuard } from '../../auth/gql-auth.guard'
import { CurrentUser } from '../../auth/currentUser'
import { CheckPolicies } from '../../casl/policy.guard'
import { AppAbility, Action } from '../../casl/casl-ability.factory'

// Pagination
import { PaginatedType, PaginationArgs } from '../../utils/Pagination'

// Auth
import { SkipAuth } from '../../auth/decorators'
import { Auth } from '../../auth/auth.model'

// User
import { User, UserDocument, PaginatedUsers } from './user.model'
import { UserService } from './user.service'
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

// Entities
import { School } from '../school/school.model'
import { Subject } from '../subject/subject.model'
import { Calendar } from '../calendar/calendar.model'
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'
import { Event } from '../event/event.model'

// Services
import { FollowerService } from '../follower/follower.service'
import { FollowingService } from '../following/following.service'

// Calendar
// import { Calendar } from '../calendar/calendar.model'

@GQL.Resolver(() => User)
export class UserResolver {
  constructor(
    private service: UserService,
    private followerService: FollowerService,
    private followingService: FollowingService,
  ) {}

  @GQL.Query(() => User)
  @CheckPolicies((a) => a.can(Action.Read, User))
  async user(
    @GQL.Args('_id', { type: () => GQL.ID }) _id: mongoose.Types.ObjectId,
  ) {
    return this.service.getById(_id)
  }

  @GQL.Query(() => PaginatedUsers)
  @CheckPolicies((ability: AppAbility) => {
    // console.log('[User] [CheckPolicies]', { ability })
    return ability.can(Action.Read, User)
  })
  async listUsers(
    @GQL.Args('filters', { nullable: true }) filters?: ListUserInput,
    @GQL.Args() paginationArgs?: PaginationArgs,
  ) {
    return this.service.list(filters, paginationArgs) //, currentUser)
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

  //
  // Field resolvers (for connections)
  //

  @GQL.ResolveField()
  async usersFollowerConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { resourceId: user._id.toString() }
    const result = this.followerService.list(filters, paginationArgs)
    return result
  }

  // TODO: OBVIOUSLY try to make some sort of reusable function for the next resolvers!

  @GQL.ResolveField(() => PaginatedUsers)
  async usersFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() paginationArgs: PaginationArgs,
  ) {
    // It is necessary to filter by resource type, because a user might be following different resources.
    const filters = { followerId: user._id, resourceName: User.name }
    const result = await this.followingService.list(filters, paginationArgs)
    return result
  }

  @GQL.ResolveField(() => PaginatedUsers)
  async schoolsFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { followerId: user._id, resourceName: School.name }
    const result = await this.followingService.list(filters, paginationArgs)
    return result
  }

  @GQL.ResolveField(() => PaginatedUsers)
  async subjectsFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { followerId: user._id, resourceName: Subject.name }
    const result = await this.followingService.list(filters, paginationArgs)
    return result
  }

  @GQL.ResolveField(() => PaginatedUsers)
  async calendarsFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { followerId: user._id, resourceName: Calendar.name }
    const result = await this.followingService.list(filters, paginationArgs)
    return result
  }

  @GQL.ResolveField(() => PaginatedUsers)
  async calendarEventsSubscribedConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { followerId: user._id, resourceName: CalendarEvent.name }
    const result = await this.followingService.list(filters, paginationArgs)
    return result
  }

  @GQL.ResolveField(() => PaginatedUsers)
  async eventsJoiningConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { followerId: user._id, resourceName: Event.name }
    const result = await this.followingService.list(filters, paginationArgs)
    return result
  }
}
