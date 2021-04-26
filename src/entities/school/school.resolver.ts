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
import { ConnectionArgs } from '../../utils/Connection'

// School
import { School, SchoolDocument, ConnectedSchools } from './school.model'
import { SchoolService } from './school.service'
import { SubjectService } from '../subject/subject.service'
import { InstituteService } from '../institute/institute.service'
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
    private instituteService: InstituteService,
    private followerService: FollowerService,
  ) {}

  @Query(() => School)
  async school(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => ConnectedSchools)
  async listSchools(
    @Args('filters', { nullable: true }) filters?: ListSchoolInput,
    @Args() connectionArgs?: ConnectionArgs,
  ) {
    return this.service.list(filters, connectionArgs)
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
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { school: school._id }
    return this.subjectService.list(filters, connectionArgs)
  }

  @ResolveField()
  async institutesConnection(
    @Parent() school: SchoolDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { school: school._id }
    return this.instituteService.list(filters, connectionArgs)
  }

  @ResolveField()
  async childrenSchoolsConnection(
    @Parent() school: SchoolDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { parentSchool: school._id }
    return this.service.list(filters, connectionArgs)
  }

  @ResolveField()
  async usersFollowerConnection(
    @Parent() school: SchoolDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { resourceId: school._id.toString() }
    const result = this.followerService.list(filters, connectionArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
