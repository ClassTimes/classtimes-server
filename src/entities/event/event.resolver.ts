import {
  // Root,
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql'
import { Types } from 'mongoose'
// import * as dayjs from 'dayjs'

// Pagination
import { PaginationArgs } from '../../utils/Pagination'

// Event
import { Event, EventDocument } from './event.model'
import { EventService } from './event.service'
import {
  CreateEventInput,
  ListEventInput,
  UpdateEventInput,
  // CreateEventInputsSchema,
} from './event.inputs'

// Services
import { FollowerService } from '../follower/follower.service'

@Resolver(() => Event)
export class EventResolver {
  constructor(
    private service: EventService,
    private followerService: FollowerService,
  ) {}

  @Query(() => Event)
  async event(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  // @Query(() => [Event])
  // async events(@Args('filters', { nullable: true }) filters?: ListEventInput) {
  //   return this.service.list(filters)
  // }

  @Mutation(() => Event)
  async createEvent(@Args('payload') payload: CreateEventInput) {
    return this.service.create(payload)
  }

  @Mutation(() => Event, { nullable: true })
  async updateEvent(@Args('payload') payload: UpdateEventInput) {
    return this.service.update(payload)
  }

  @Mutation(() => Event, { nullable: true })
  async deleteEvent(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }

  //
  // Properties

  // @ResolveField()
  // async endDateUtc(@Root() event: Event) {
  //   const _endDateUtc = dayjs(event.startDateUtc)
  //     .utc()
  //     .add(event.durationHours, 'hours')

  //   console.log({
  //     event: event.title,
  //     _endDateUtc,
  //   })

  //   return _endDateUtc.toDate()
  // }

  //
  // Relations

  //
  // Field resolvers (for connections)
  //

  @ResolveField()
  async usersJoiningConnection(
    @Parent() event: EventDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { resourceId: event._id.toString() }
    const result = this.followerService.list(filters, paginationArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
