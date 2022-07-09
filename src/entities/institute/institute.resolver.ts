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

// Pagination
import { ConnectionArgs } from '@utils/Connection'

import {
  Institute,
  InstituteDocument,
  ConnectedInstitutes,
} from '@entities/institute/institute.model'
import { InstituteService } from './institute.service'
import { SubjectService } from '@entities/subject/subject.service'
import { FollowerService } from '@modules/follower/follower.service'
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

  @Query(() => ConnectedInstitutes)
  async listInstitutes(
    @Args('filters', { nullable: true }) filters?: ListInstituteInput,
    @Args() connectionArgs?: ConnectionArgs,
  ) {
    return this.service.list(filters, connectionArgs)
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
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { institute: institute._id }
    return this.subjectService.list(filters, connectionArgs)
  }

  @ResolveField()
  async usersFollowerConnection(
    @Parent() institute: InstituteDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { resourceId: institute._id.toString() }
    const result = this.followerService.list(filters, connectionArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
