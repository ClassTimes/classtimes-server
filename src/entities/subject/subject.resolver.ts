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

// Subject
import { Subject, SubjectDocument } from './subject.model'
import { CreateSubjectInput, UpdateSubjectInput } from './subject.inputs'

// Services
import { SubjectService } from './subject.service'
import { CalendarEventService } from '@entities/calendarEvent/calendarEvent.service'
import { DiscussionService } from '@modules/discussion/discussion.service'
import { FollowerService } from '@modules/follower/follower.service'

@Resolver(() => Subject)
export class SubjectResolver {
  constructor(
    private service: SubjectService,
    private discussionService: DiscussionService,
    private calendarEventService: CalendarEventService,
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
  async calendarEventsConnection(
    @Parent() subject: SubjectDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { subject: subject._id }
    return this.calendarEventService.list(filters, connectionArgs)
  }

  @ResolveField()
  async discussionsConnection(
    @Parent() subject: SubjectDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { subject: subject._id }
    return this.discussionService.list(filters, connectionArgs)
  }

  @ResolveField()
  async usersFollowerConnection(
    @Parent() subject: SubjectDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { resourceId: subject._id.toString() }
    const result = this.followerService.list(filters, connectionArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
