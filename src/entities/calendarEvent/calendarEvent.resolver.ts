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
import dayjs from 'dayjs'

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
  ListCalendarEventInput,
  UpdateCalendarEventInput,
  IntervalArgs,
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
  async calendarEventsInRange(@Args() intervalArgs: IntervalArgs) {
    return null
  }
  // @Query(() => [CalendarEvent])
  // async calendarEvents(
  //   @Args('filters', { nullable: true }) filters?: ListCalendarEventInput,
  // ) {
  //   return this.service.list(filters)
  // }
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

  //
  // Properties

  @ResolveField() // TODO Compute on save not on read so can be indexed
  async endDateUtc(@Root() calendarEvent: CalendarEvent) {
    const _endDateUtc = dayjs(calendarEvent.startDateUtc)
      .utc()
      .add(calendarEvent.durationHours, 'hours')

    console.log({
      calendarEvent: calendarEvent.title,
      _endDateUtc,
    })

    return _endDateUtc.toDate()
  }

  //
  // Connection resolvers
  //
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
