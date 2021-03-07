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

// Event
import { Event, EventDocument } from './event.model'
import { EventService } from './event.service'
import {
  CreateEventInput,
  ListEventInput,
  UpdateEventInput,
  // CreateEventInputsSchema,
} from './event.inputs'

// Calendar
import { Calendar } from '../calendar/calendar.model'

@Resolver(() => Event)
export class EventResolver {
  constructor(private service: EventService) {}

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

  @ResolveField()
  async calendar(
    @Parent() event: EventDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate) {
      await event
        .populate({ path: 'calendar', model: Calendar.name })
        .execPopulate()
    }

    return event.calendar
  }
}

// import { Resolver } from '@nestjs/graphql';
//
// @Resolver()
// export class EventResolver {}
