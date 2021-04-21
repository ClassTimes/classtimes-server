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
import { CalendarEventService } from '../calendarEvent/calendarEvent.service'
import { FollowerService } from '../follower/follower.service'

@Resolver(() => Calendar)
export class CalendarResolver {
  constructor(
    private service: CalendarService,
    private calendarEventService: CalendarEventService,
    private followerService: FollowerService,
  ) {}

  @Query(() => Calendar)
  async calendar(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  // @Query(() => [Calendar])
  // async calendars(
  //   @Args('filters', { nullable: true }) filters?: ListCalendarInput,
  // ) {
  //   return this.service.list(filters)
  // }

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

  //
  // Field resolvers (for connections)
  //

  @ResolveField()
  async calendarEventsConnection(
    @Parent() calendar: CalendarDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { calendar: calendar._id }
    return this.calendarEventService.list(filters, paginationArgs)
  }

  @ResolveField()
  async usersFollowerConnection(
    @Parent() calendar: CalendarDocument,
    @Args() paginationArgs: PaginationArgs,
  ) {
    const filters = { resourceId: calendar._id.toString() }
    const result = this.followerService.list(filters, paginationArgs)
    // TODO: Is it necessary to filter by resourceName as well?
    return result
  }
}
