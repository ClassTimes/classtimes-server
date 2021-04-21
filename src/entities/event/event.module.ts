import { Module } from '@nestjs/common'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'

import { EventService } from './event.service'
import { Event, EventSchema } from './event.model'
import { EventResolver } from './event.resolver'
import {
  CalendarEvent,
  CalendarEventSchema,
} from '../calendarEvent/calendarEvent.model'
// import { User, UserSchema } from '../user/user.model'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: CalendarEvent.name,
        schema: CalendarEventSchema,
      },
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
    ]),
  ],
  providers: [
    EventService,
    EventResolver,
    FollowerService,
    // {
    //   provide: getModelToken(Event.name),
    //   useValue: eventModel,
    // },
  ],
})
export class EventModule {}
