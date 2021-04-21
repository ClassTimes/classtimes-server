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
import { PaginationArgs } from '../../utils/Pagination'

// Subject
import { Subject, SubjectDocument } from './subject.model'
import {
  CreateSubjectInput,
  ListSubjectInput,
  UpdateSubjectInput,
} from './subject.inputs'

// Services
import { SubjectService } from './subject.service'
import { CalendarService } from '../calendar/calendar.service'
import { FollowerService } from '../follower/follower.service'

@Resolver(() => Subject)
export class SubjectResolver {
  constructor(
    private service: SubjectService,
    private calendarService: CalendarService,
    private followerService: FollowerService,
  ) {}

  @Query(() => Subject)
  async subject(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  // @Query(() => [Subject])
  // async subjects(
  //   @Args('filters', { nullable: true }) filters?: ListSubjectInput,
  // ) {
  //   return this.service.list(filters)
  // }

  @Mutation(() => Subject)
  async createSubject(@Args('payload') payload: CreateSubjectInput) {
    return this.service.create(payload)
  }

  @Mutation(() => Subject)
  async updateSubject(@Args('payload') payload: UpdateSubjectInput) {
    return this.service.update(payload)
  }

  @Mutation(() => Subject)
  async deleteSubject(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  //
  // Field resolvers (for connections)
  //

  @ResolveField()
  async calendarsConnection(
    @Parent() subject: SubjectDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { subject: subject._id }
    return this.calendarService.list(filters, paginationArgs)
  }

  @ResolveField()
  async usersFollowerConnection(
    @Parent() subject: SubjectDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { resourceId: subject._id.toString() }
    const result = this.followerService.list(filters, paginationArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
