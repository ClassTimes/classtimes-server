import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql'
import { Model, Types } from 'mongoose'

// Pagination
import { PaginationArgs } from '../../utils/Pagination'

// Career
import { Career, CareerDocument, PaginatedCareers } from './career.model'
import { CareerService } from './career.service'

import { CreateCareerSubjectInput } from '../careerSubject/careerSubject.inputs'
import { CareerSubjectService } from '../careerSubject/careerSubject.service'

// import { SchoolService } from './school.service'
// import { SubjectService } from '../subject/subject.service'
// import { InstituteService } from '../institute/institute.service'
// import { FollowerService } from '../follower/follower.service'
import {
  ApproveCareerInput,
  CreateCareerInput,
  ListCareerInput,
  UpdateCareerInput,
} from './career.inputs'

@Resolver(() => Career)
export class CareerResolver {
  constructor(
    private service: CareerService,
    private careerSubjectService: CareerSubjectService,
  ) {}

  @Query(() => Career)
  async career(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => PaginatedCareers)
  async listCareers(
    @Args('filters', { nullable: true }) filters?: ListCareerInput,
    @Args() paginationArgs?: PaginationArgs,
  ) {
    return this.service.list(filters, paginationArgs)
  }

  @Mutation(() => Career)
  async createCareer(@Args('payload') payload: CreateCareerInput) {
    return this.service.create(payload)
  }

  @Mutation(() => Career)
  async updateCareer(@Args('payload') payload: UpdateCareerInput) {
    return this.service.update(payload)
  }

  @Mutation(() => Career)
  async deleteCareer(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  @Mutation(() => Career)
  async addSubjectToCareer(
    @Args('payload')
    payload: CreateCareerSubjectInput,
  ) {
    return this.careerSubjectService.create(payload)
  }

  @Mutation(() => Career)
  async approveCareerBySchool(
    @Args('payload')
    payload: ApproveCareerInput,
  ) {
    return this.service.approveCareer(payload)
  }

  /*
   * Field resolvers (for connections)
   */

  @ResolveField()
  async subjectsConnection(
    @Parent() career: CareerDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { careerId: career._id }
    return this.careerSubjectService.list(filters, paginationArgs)
  }
}
