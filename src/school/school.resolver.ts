import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Types } from 'mongoose'

import { School } from './school.model'
import { SchoolService } from './school.service'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'

@Resolver(() => School)
export class SchoolResolver {
  constructor(private service: SchoolService) {}

  @Query(() => School)
  async school(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [School])
  async schools(
    @Args('filters', { nullable: true }) filters?: ListSchoolInput,
  ) {
    return this.service.list(filters)
  }

  @Mutation(() => School)
  async createSchool(@Args('payload') payload: CreateSchoolInput) {
    return this.service.create(payload)
  }

  @Mutation(() => School)
  async updateSchool(@Args('payload') payload: UpdateSchoolInput) {
    return this.service.update(payload)
  }

  @Mutation(() => School)
  async deleteSchool(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }
}

// import { Resolver } from '@nestjs/graphql';

// @Resolver()
// export class SchoolResolver {}
