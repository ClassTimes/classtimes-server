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

import { CreateFollowInput, DeleteFollowInput } from './follow.input'

// Following
import { FollowingService } from '../following/following.service'

import { SchoolService } from '../school/school.service'
import { SubjectService } from '../subject/subject.service'
import { CalendarService } from '../calendar/calendar.service'

@Resolver(() => Follow) // Follow?
export class FollowResolver {
  constructor(
    private followerService: FollowerService,
    private followingService: FollowingService,
    private schoolService: SchoolService,
    private subjectService: SubjectService,
    private calendarService: CalendarService,
  ) {}

  async createFollowForResource(resourceName, resourceId, userId) {
    const payload = {
      resourceName,
      resourceId,
      userId,
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
    }

    return following
  }

  @Mutation(() => Follow) // Follow?
  async followSchool(
    @Args('schoolId', { type: () => ID }) schoolId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource('School', schoolId, user._id.toString())
  }

  @Mutation(() => Follow) // Follow?
  async followSubject(
    @Args('subjectId', { type: () => ID }) subjectId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource(
      'Subject',
      subjectId,
      user._id.toString(),
    )
  }

  @Mutation(() => Follow) // Follow?
  async followCalendar(
    @Args('calendarId', { type: () => ID }) calendarId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    return this.createFollowForResource(
      'Calendar',
      calendarId,
      user._id.toString(),
    )
  }

  @Mutation(() => Follow) // Follow?
  async unfollowResource(
    @Args('resourceId', { type: () => ID }) resourceId: Types.ObjectId,
    @CurrentUser() user: User,
  ) {
    await this.followerService.delete(resourceId, user._id.toString())
    const following = await this.followingService.delete(
      resourceId,
      user._id.toString(),
    )

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
    }

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
