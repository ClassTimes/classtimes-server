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
  ) {}

  @Query(() => School)
  async school(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  // @Query(() => OffsetPaginatedSchools)
  // async schools(
  //   @Args('filters', { nullable: true }) filters?: ListSchoolInput,
  //   @Args('first', { nullable: true }) first?: number,
  //   @Args('offset', { nullable: true }) offset?: number,
  // ) {
  //   const schools = await this.service.list(filters, first, offset)
  //   return schools
  // }

  @Query(() => PaginatedSchools)
  async schoolsConnection(
    // @Args('filters', { nullable: true }) filters?: ListSchoolInput,
    @Args('first', { nullable: true }) first?: number,
    @Args('after', { nullable: true }) after?: string,
    @Args('before', { nullable: true }) before?: string,
  ) {
    const schools = await this.service.list(null, first, after, before)
    return schools
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
    const { first, after, before } = paginationArgs
    const filters = { school: school._id }
    return this.subjectService.list(filters, first, after, before)
  }
}
