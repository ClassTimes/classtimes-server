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
import { plainToClass } from 'class-transformer'

// Auth
import { ForbiddenError } from '@casl/ability'
import { CheckPolicies } from '../../casl/policy.guard'
import { Action } from '../../casl/casl-ability.factory'
import { CaslAbilityFactory } from '../../casl/casl-ability.factory'
import { CurrentUser } from '../../auth/currentUser'

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

// User
import { User } from '../user/user.model'

@Resolver(() => School)
export class SchoolResolver {
  constructor(private service: SchoolService) {}

  @Query(() => School)
  @CheckPolicies((a) => true)
  async school(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [School])
  @CheckPolicies((a) => true)
  async schools(
    @Args('filters', { nullable: true }) filters?: ListSchoolInput,
  ) {
    const schoolList = await this.service.list(filters)
    for (const school of schoolList) {
      await this.service.checkPermissons(Action.Read, school._id)
    }
    return schoolList
  }

  @Mutation(() => School)
  @CheckPolicies((a) => true)
  async createSchool(@Args('payload') payload: CreateSchoolInput) {
    return this.service.create(payload)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => true)
  async updateSchool(@Args('payload') payload: UpdateSchoolInput) {
    return this.service.update(payload)
  }

  @Mutation(() => School)
  @CheckPolicies((a) => true)
  async deleteSchool(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    //await this.service.checkPermissons(Action.Delete, _id)
    return this.service.delete(_id)
  }

  //
  // Field resolvers (deprecated in favor of mongoose-autopopulate)
  //

  /*@ResolveField()
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

  @ResolveField('createdBy', () => User)
  async createdBy(
    @Parent() school: SchoolDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      console.log(school)
      await school
        .populate({ path: 'createdBy', model: User.name })
        .execPopulate()
    }
    return school.createdBy
  }*/
}
