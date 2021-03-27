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

// Event
import { Event, EventDocument } from './event.model'
import { EventService } from './event.service'
import {
  CreateEventInput,
  ListEventInput,
  UpdateEventInput,
  // CreateEventInputsSchema,
} from './event.inputs'

// CalendarEvent
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'

// User
import { User } from '../user/user.model'

@Resolver(() => Event)
export class EventResolver {
  constructor(private service: EventService) { }

  @Query(() => Event)
  async event(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  @Query(() => [Event])
  async events(@Args('filters', { nullable: true }) filters?: ListEventInput) {
    return this.service.list(filters)
  }

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

  @ResolveField()
  async calendarEvent(
    @Parent() event: EventDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await event
        .populate({ path: 'calendarEvent', model: CalendarEvent.name })
        .execPopulate()
    }

    return event.calendarEvent
  }

  @ResolveField()
  async usersJoining(
    @Parent() event: EventDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await event
        .populate({ path: 'usersJoining', model: User.name })
        .execPopulate()
    }

    return event.usersJoining
  }
}

// import { Resolver } from '@nestjs/graphql';
//
// @Resolver()
// export class EventResolver {}

// const startDateUtc = dayjs(this.startDateUtc).utc()
// if (!this.rrule) {
//   const endDateUtc = startDateUtc.add(this.durationHours, 'hours')
//   return endDateUtc.toDate()
// }
// const rule = RRule.fromString(
//   `DTSTART:${startDateUtc.format('YYYYMMDD[T]HHmmss')}Z\nRRULE:${
//     this.rrule
//   }`,
// )
//   if(rule.count()) // || rule.options.until
// rule.options.dtstart = start.toDate()
// const ruleQuery = rule.between(startDateUtc, endDateUtc, false)
// for (const ruleDate of ruleQuery) {
//   if (ruleDate.valueOf() === start.valueOf()) {
//     // skip same event
//     continue
//   }
// }
