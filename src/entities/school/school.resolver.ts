import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql'
import { Types } from 'mongoose'

// Auth
import { CheckPolicies } from '../../casl/policy.guard'
import { AppAbility, Action } from '../../casl/casl-ability.factory'

// School
import { School, SchoolDocument } from './school.model'
import { SchoolService } from './school.service'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'

// Subject
import { Subject } from '../subject/subject.model'

@Resolver(() => School)
export class SchoolResolver {
  constructor(private service: SchoolService) {}

  @Query(() => School)
  @CheckPolicies((a) => a.can(Action.Read, School))
  async school(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [School])
  @CheckPolicies((a) => a.can(Action.List, School))
  async schools(
    @Args('filters', { nullable: true }) filters?: ListSchoolInput,
  ) {
    return this.service.list(filters)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => a.can(Action.Create, School))
  async createSchool(@Args('payload') payload: CreateSchoolInput) {
    return this.service.create(payload)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => a.can(Action.Update, School))
  async updateSchool(@Args('payload') payload: UpdateSchoolInput) {
    return this.service.update(payload)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => a.can(Action.Delete, School))
  async deleteSchool(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  // @CheckPolicies((a) => a.can(Action.Update, School))
  @ResolveField()
  async subjects(
    @Parent() school: SchoolDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await school
        .populate({ path: 'subjects', model: Subject.name })
        .execPopulate()
    }

    return school.subjects
  }
}
