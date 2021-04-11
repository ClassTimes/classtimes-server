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

import { Follow } from './follow.model'

// Follower
import { Follower, FollowerDocument } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'

import { CreateFollowInput, DeleteFollowInput } from './follow.input'

// Following
// import { Following, FollowingDocument } from '../following/following.model'
import { FollowingService } from '../following/following.service'
// import { CreateFollowingInput } from '../following/following.input'

// import {
//   CreateSchoolInput,
//   ListSchoolInput,
//   UpdateSchoolInput,
// } from './school.inputs'

@Resolver(() => Follow) // Follow?
export class FollowResolver {
  constructor(
    private followerService: FollowerService,
    private followingService: FollowingService,
  ) {}

  async createFollowForResource(resourceName, payload) {
    const updatedPayload = {
      resourceName,
      ...payload,
    }
    await this.followingService.create(updatedPayload)
    return this.followerService.create(updatedPayload)
  }

  @Mutation(() => Follow) // Follow?
  async followSchool(@Args('payload') payload: CreateFollowInput) {
    return this.createFollowForResource('School', payload)
  }

  @Mutation(() => Follow) // Follow?
  async followSubject(@Args('payload') payload: CreateFollowInput) {
    return this.createFollowForResource('Subject', payload)
  }

  @Mutation(() => Follow) // Follow?
  async followCalendar(@Args('payload') payload: CreateFollowInput) {
    return this.createFollowForResource('Calendar', payload)
  }

  @Mutation(() => Follow) // Follow?
  async unfollowResource(@Args('payload') payload: DeleteFollowInput) {
    await this.followingService.delete(payload.resourceId, payload.userId)
    return this.followerService.delete(payload.resourceId, payload.userId)
  }

  @Query(() => Count)
  async countFollowing(
    @Args('resourceId', { type: () => ID }) resourceId: Types.ObjectId,
  ) {
    return this.followingService.countFollowing(resourceId)
  }
}

// TODO: Move to a different file

@ObjectType()
class Count {
  @Field(() => Number)
  value: number
}
