import {
  Root,
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

// CalendarEvent
import {
  CalendarEvent,
  CalendarEventDocument,
  PaginatedCalendarEvents,
} from './calendarEvent.model'
import {
  CreateCalendarEventInput,
  ListCalendarEventsInput,
  UpdateCalendarEventInput,
  // CreateCalendarEventInputsSchema,
} from './calendarEvent.inputs'

// Services
import { CalendarEventService } from './calendarEvent.service'
import { EventService } from '../event/event.service'
import { FollowerService } from '../follower/follower.service'
@Resolver(() => CalendarEvent)
export class CalendarEventResolver {
  constructor(
    private service: CalendarEventService,
    private eventService: EventService,
    private followerService: FollowerService,
  ) {}

  @Query(() => CalendarEvent)
  async calendarEvent(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => PaginatedCalendarEvents)
  async listCalendarEvents(
    @Args('filters') filters: ListCalendarEventsInput,
    @Args() connectionArgs: PaginationArgs,
  ) {
    return this.service.search(filters, connectionArgs)
  }

  @Mutation(() => CalendarEvent)
  async createCalendarEvent(
    @Args('payload') payload: CreateCalendarEventInput,
  ) {
    return this.service.create(payload)
  }

  @Mutation(() => CalendarEvent, { nullable: true })
  async updateCalendarEvent(
    @Args('payload') payload: UpdateCalendarEventInput,
  ) {
    return this.service.update(payload)
  }

  @Mutation(() => CalendarEvent, { nullable: true })
  async deleteCalendarEvent(
    @Args('_id', { type: () => ID }) _id: Types.ObjectId,
  ) {
    return this.service.delete(_id)
  }

  /*
   * Connection resolvers
   */

  @ResolveField()
  async eventsConnection(
    @Parent() calendarEvent: CalendarEventDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { calendarEvent: calendarEvent._id }
    return this.eventService.list(filters, paginationArgs)
  }

  @ResolveField()
  async usersSubscriberConnection(
    @Parent() calendarEvent: CalendarEventDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { resourceId: calendarEvent._id.toString() }
    const result = this.followerService.list(filters, paginationArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
