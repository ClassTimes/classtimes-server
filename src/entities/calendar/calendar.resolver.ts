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

// Calendar
import { Calendar, CalendarDocument } from './calendar.model'
import { CalendarService } from './calendar.service'
import {
  CreateCalendarInput,
  ListCalendarInput,
  UpdateCalendarInput,
  // CreateCalendarInputsSchema,
} from './calendar.inputs'

// Model
import { Subject } from '../subject/subject.model'
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'

@Resolver(() => Calendar)
export class CalendarResolver {
  constructor(private service: CalendarService) {}

  @Query(() => Calendar)
  async calendar(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [Calendar])
  async calendars(
    @Args('filters', { nullable: true }) filters?: ListCalendarInput,
  ) {
    return this.service.list(filters)
  }

  @Mutation(() => Calendar)
  async createCalendar(@Args('payload') payload: CreateCalendarInput) {
    return this.service.create(payload)
  }

  @Mutation(() => Calendar, { nullable: true })
  async updateCalendar(@Args('payload') payload: UpdateCalendarInput) {
    return this.service.update(payload)
  }

  @Mutation(() => Calendar, { nullable: true })
  async deleteCalendar(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }
}
