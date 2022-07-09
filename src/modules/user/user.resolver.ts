// import { UseGuards } from '@nestjs/common'
import * as GQL from '@nestjs/graphql' //{ Args, Mutation, Query, Resolver, ID }
import mongoose from 'mongoose'

// Guard
// import { GqlAuthGuard } from '../../auth/gql-auth.guard'
import { CurrentUser } from '@modules/auth/currentUser'
import { CheckPolicies } from '@modules/casl/policy.guard'
import { AppAbility, Action } from '@modules/casl/casl-ability.factory'

// Pagination
import { ConnectionArgs } from '@utils/Connection'

// Auth
import { SkipAuth } from '@modules/auth/decorators'
import { Auth } from '@modules/auth/auth.model'

// User
import { User, UserDocument, ConnectedUsers } from './user.model'
import { UserService } from './user.service'
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

// Entities
import { School } from '@modules/school/school.model'
import { Subject } from '@entities/subject/subject.model'
import { Institute } from '@entities/institute/institute.model'
import { CalendarEvent } from '@entities/calendarEvent/calendarEvent.model'
import { Event } from '@modules/event/event.model'

// Services
import { FollowerService } from '@modules/follower/follower.service'
import { FollowingService } from '@modules/following/following.service'

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

  @GQL.Query(() => ConnectedUsers)
  @CheckPolicies((ability: AppAbility) => {
    // console.log('[User] [CheckPolicies]', { ability })
    return ability.can(Action.Read, User)
  })
  async listUsers(
    @GQL.Args('filters', { nullable: true }) filters?: ListUserInput,
    @GQL.Args() connectionArgs?: ConnectionArgs,
  ) {
    return this.service.list(filters, connectionArgs) //, currentUser)
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
    @GQL.Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { resourceId: user._id.toString() }
    const result = this.followerService.list(filters, connectionArgs)
    return result
  }

  // TODO: OBVIOUSLY try to make some sort of reusable function for the next resolvers!

  @GQL.ResolveField(() => ConnectedUsers)
  async usersFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() connectionArgs: ConnectionArgs,
  ) {
    // It is necessary to filter by resource type, because a user might be following different resources.
    const filters = { followerId: user._id, resourceName: User.name }
    const result = await this.followingService.list(filters, connectionArgs)
    return result
  }

  @GQL.ResolveField(() => ConnectedUsers)
  async schoolsFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { followerId: user._id, resourceName: School.name }
    const result = await this.followingService.list(filters, connectionArgs)
    return result
  }

  @GQL.ResolveField(() => ConnectedUsers)
  async subjectsFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { followerId: user._id, resourceName: Subject.name }
    const result = await this.followingService.list(filters, connectionArgs)
    return result
  }

  @GQL.ResolveField(() => ConnectedUsers)
  async institutesFollowingConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { followerId: user._id, resourceName: Institute.name }
    const result = await this.followingService.list(filters, connectionArgs)
    return result
  }

  @GQL.ResolveField(() => ConnectedUsers)
  async calendarEventsSubscribedConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { followerId: user._id, resourceName: CalendarEvent.name }
    const result = await this.followingService.list(filters, connectionArgs)
    return result
  }

  @GQL.ResolveField(() => ConnectedUsers)
  async eventsJoiningConnection(
    @GQL.Parent() user: UserDocument,
    @GQL.Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { followerId: user._id, resourceName: Event.name }
    const result = await this.followingService.list(filters, connectionArgs)
    return result
  }
}
