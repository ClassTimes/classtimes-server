import {
  Args,
  Mutation,
  Query,
  Resolver,
  Field,
  ObjectType,
  ID,
} from '@nestjs/graphql'
import { Types } from 'mongoose'

// Current User
import { User } from '../user/user.model'
import { CurrentUser } from '../../auth/currentUser'

import { Follow } from './follow.model'

// Follower
import { FollowerService } from '../follower/follower.service'

// Following
import { Following } from '../following/following.model'
import { FollowingService } from '../following/following.service'

// Resource services
import { SchoolService } from '../school/school.service'
import { SubjectService } from '../subject/subject.service'
import { CalendarService } from '../calendar/calendar.service'
import { CalendarEventService } from '../calendarEvent/calendarEvent.service'
import { EventService } from '../event/event.service'
import { UserService } from '../user/user.service'

@Resolver(() => Follow)
export class FollowResolver {
  constructor(
    private followerService: FollowerService,
    private followingService: FollowingService,
    private schoolService: SchoolService,
    private subjectService: SubjectService,
    private calendarService: CalendarService,
    private calendarEventService: CalendarEventService,
    private eventService: EventService,
    private userService: UserService,
  ) {}

  async createFollowForResource(resourceName, resourceId, userId) {
    const payload = {
      resourceName,
      resourceId,
      followerId: userId,
    }
    await this.followerService.create(payload)
    const following = await this.followingService.create(payload)

    switch (resourceName) {
      case 'School':
        // update school followingCount
        this.schoolService.increaseFollowingCount(resourceId)
        break
      case 'School':
        // update subject followingCount
        this.subjectService.increaseFollowingCount(resourceId)
        break
      case 'Calendar':
        // update calendar followingCount
        this.calendarService.increaseFollowingCount(resourceId)
        break
      case 'CalendarEvent':
        // update calendarEvent followingCount
        this.calendarEventService.increaseFollowingCount(resourceId)
        break
      case 'Event':
        // update event followingCount
        this.eventService.increaseFollowingCount(resourceId)
        break
    }

    return following
  }

  // ------------------------------------------------------------------------------
  // Follow / Join / Suscribe -----------------------------------------------------

  @Mutation(() => Following)
  async followSchool(
    @Args('schoolId', { type: () => ID }) schoolId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource('School', schoolId, user._id)
  }

  @Mutation(() => Following)
  async followSubject(
    @Args('subjectId', { type: () => ID }) subjectId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource('Subject', subjectId, user._id)
  }

  @Mutation(() => Following)
  async followCalendar(
    @Args('calendarId', { type: () => ID }) calendarId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource('Calendar', calendarId, user._id)
  }

  @Mutation(() => Following)
  async subscribeToCalendarEvent(
    @Args('calendarEventId', { type: () => ID })
    calendarEventId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource(
      'CalendarEvent',
      calendarEventId,
      user._id,
    )
  }

  @Mutation(() => Following)
  async joinEvent(
    @Args('eventId', { type: () => ID })
    eventId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource('Event', eventId, user._id)
  }

  // Users
  @Mutation(() => Following)
  async followUser(
    @Args('followeeId', { type: () => ID }) followeeId: Types.ObjectId,
    @CurrentUser() user: User, // follower
  ) {
    // The followee will receive a *new follower*, and in turn,
    // the follower will be *following* a new followee.

    // -following- is indexed by userId *first*, to query
    // which resources (in this case, users) the currentUser is a follower of.

    // -follower- is indexed by resourceId *first*, to query
    // which users are followers of the currentResource (in this case, user)

    const payload = {
      resourceName: 'User',
      resourceId: followeeId, // resourceId represents the followee
      followerId: user._id, // userId represents the follower
    }

    await this.followerService.create(payload)
    const following = await this.followingService.create(payload)

    this.userService.increaseFollowerCount(followeeId)
    this.userService.increaseFollowingCount(user._id)

    return following
  }

  // ------------------------------------------------------------------------------
  // Unfollow / Join / unsuscribe -------------------------------------------------

  @Mutation(() => Following)
  async unfollowResource(
    @Args('resourceId', { type: () => ID }) resourceId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    await this.followerService.delete(resourceId, user._id)
    const following = await this.followingService.delete(resourceId, user._id)

    switch (following.resourceName) {
      case 'School': // TODO: Import from class
        // update school followingCount
        this.schoolService.decreaseFollowingCount(resourceId)
        break
      case 'Subject':
        // update subject followingCount
        this.subjectService.decreaseFollowingCount(resourceId)
        break
      case 'Calendar':
        // update calendar followingCount
        this.calendarService.decreaseFollowingCount(resourceId)
        break
      case 'CalendarEvent':
        // update calendarEvent followingCount
        this.calendarEventService.decreaseFollowingCount(resourceId)
        break
      case 'Event':
        // update event followingCount
        this.eventService.decreaseFollowingCount(resourceId)
        break
    }

    return following
  }

  // Users
  @Mutation(() => Following)
  async unfollowUser(
    @Args('followeeId', { type: () => ID }) followeeId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    await this.followerService.delete(followeeId, user._id)
    const following = await this.followingService.delete(followeeId, user._id)

    this.userService.decreaseFollowerCount(followeeId)
    this.userService.decreaseFollowingCount(user._id)

    return following
  }

  // @Query(() => Count)
  // async countFollowing(
  //   @Args('resourceId', { type: () => ID }) resourceId: Types.ObjectId,
  // ) {
  //   return this.followingService.countFollowing(resourceId)
  // }
}

// TODO: Move to a different file

// @ObjectType()
// class Count {
//   @Field(() => Number)
//   value: number
// }
