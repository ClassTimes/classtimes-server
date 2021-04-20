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

// School
import { School, SchoolDocument, PaginatedSchools } from './school.model'
import { SchoolService } from './school.service'
import { SubjectService } from '../subject/subject.service'
import { FollowerService } from '../follower/follower.service'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'
@Resolver(() => School)
export class SchoolResolver {
  constructor(
    private service: SchoolService,
    private subjectService: SubjectService,
    private followerService: FollowerService,
  ) {}

  @Query(() => School)
  async school(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => PaginatedSchools)
  async listSchools(
    @Args('filters', { nullable: true }) filters?: ListSchoolInput,
    @Args() paginationArgs?: PaginationArgs,
  ) {
    return this.service.list(filters, paginationArgs)
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
  async deleteSchool(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  //
  // Field resolvers (for connections)
  //

  @ResolveField()
  async subjectsConnection(
    @Parent() school: SchoolDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { school: school._id }
    return this.subjectService.list(filters, paginationArgs)
  }

  @ResolveField()
  async childrenSchoolsConnection(
    @Parent() school: SchoolDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { parentSchool: school._id }
    return this.service.list(filters, paginationArgs)
  }

  @ResolveField()
  async usersFollowerConnection(
    @Parent() school: SchoolDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { resourceId: school._id.toString() }
    const result = this.followerService.list(filters, paginationArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
