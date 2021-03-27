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

// CalendarEvent
import { CalendarEvent, CalendarEventDocument } from './calendarEvent.model'
import { CalendarEventService } from './calendarEvent.service'
import {
  CreateCalendarEventInput,
  ListCalendarEventInput,
  UpdateCalendarEventInput,
  // CreateCalendarEventInputsSchema,
} from './calendarEvent.inputs'

// Calendar
import { Calendar } from '../calendar/calendar.model'

@Resolver(() => CalendarEvent)
export class CalendarEventResolver {
  constructor(private service: CalendarEventService) { }

  @Query(() => CalendarEvent)
  async calendarEvent(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [CalendarEvent])
  async calendarEvents(
    @Args('filters', { nullable: true }) filters?: ListCalendarEventInput,
  ) {
    return this.service.list(filters)
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
  // Relations

  @ResolveField()
  async calendar(
    @Parent() calendarEvent: CalendarEventDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await calendarEvent
        .populate({ path: 'calendar', model: Calendar.name })
        .execPopulate()
    }

    return calendarEvent.calendar
  }
}
