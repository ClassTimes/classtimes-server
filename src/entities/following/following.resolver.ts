import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql'
import { Types } from 'mongoose'

// Following
import { Following, FollowingDocument } from './following.model'
import { FollowingService } from './following.service'
import { CreateFollowingInput } from './following.input'
// import {
//   CreateSchoolInput,
//   ListSchoolInput,
//   UpdateSchoolInput,
// } from './school.inputs'

@Resolver(() => Following)
export class FollowingResolver {
  constructor(private service: FollowingService) {}

  @Mutation(() => Following)
  async createFollowing(@Args('payload') payload: CreateFollowingInput) {
    return this.service.create(payload)
  }
}
