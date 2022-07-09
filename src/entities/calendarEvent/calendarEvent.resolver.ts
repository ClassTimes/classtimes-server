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
import { ConnectionArgs } from '@utils/Connection'

// CalendarEvent
import {
  CalendarEvent,
  CalendarEventDocument,
  ConnectedCalendarEvents,
} from './calendarEvent.model'
import {
  CreateCalendarEventInput,
  ListCalendarEventsInput,
  UpdateCalendarEventInput,
  // CreateCalendarEventInputsSchema,
} from './calendarEvent.inputs'

// Services
import { CalendarEventService } from './calendarEvent.service'
import { EventService } from '@modules/event/event.service'
import { FollowerService } from '@entities/follower/follower.service'
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

  @Query(() => ConnectedCalendarEvents)
  async listCalendarEvents(
    @Args('filters', { nullable: true }) filters: ListCalendarEventsInput,
    @Args() connectionArgs: ConnectionArgs,
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
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { calendarEvent: calendarEvent._id }
    return this.eventService.list(filters, connectionArgs)
  }

  @ResolveField()
  async usersSubscriberConnection(
    @Parent() calendarEvent: CalendarEventDocument,
    @Args() connectionArgs: ConnectionArgs,
  ) {
    const filters = { resourceId: calendarEvent._id.toString() }
    const result = this.followerService.list(filters, connectionArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
