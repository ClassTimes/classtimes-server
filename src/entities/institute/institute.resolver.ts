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

import {
  Institute,
  InstituteDocument,
  PaginatedInstitutes,
} from '../institute/institute.model'
import { InstituteService } from './institute.service'
import { SchoolService } from '../school/school.service'
import { SubjectService } from '../subject/subject.service'
import { FollowerService } from '../follower/follower.service'
import {
  CreateInstituteInput,
  ListInstituteInput,
  UpdateInstituteInput,
} from './institute.inputs'

@Resolver(() => Institute)
export class InstituteResolver {
  constructor(
    private service: InstituteService,
    private subjectService: SubjectService,
    private followerService: FollowerService,
  ) {}

  @Query(() => Institute)
  async institute(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => PaginatedInstitutes)
  async listInstitutes(
    @Args('filters', { nullable: true }) filters?: ListInstituteInput,
    @Args() paginationArgs?: PaginationArgs,
  ) {
    return this.service.list(filters, paginationArgs)
  }

  @Mutation(() => Institute)
  async createInstitute(@Args('payload') payload: CreateInstituteInput) {
    return this.service.create(payload)
  }

  @Mutation(() => Institute)
  async updateInstitute(@Args('payload') payload: UpdateInstituteInput) {
    return this.service.update(payload)
  }

  @Mutation(() => Institute)
  async deleteInstitute(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  //
  // Field resolvers (for connections)
  //

  @ResolveField()
  async subjectsConnection(
    @Parent() institute: InstituteDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { institute: institute._id }
    return this.subjectService.list(filters, paginationArgs)
  }

  @ResolveField()
  async usersFollowerConnection(
    @Parent() institute: InstituteDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { resourceId: institute._id.toString() }
    const result = this.followerService.list(filters, paginationArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
