import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventService } from './event.service'
import { Event, EventSchema } from './event.model'
import { EventResolver } from './event.resolver'
import {
  CalendarEvent,
  CalendarEventSchema,
} from '@entities/calendarEvent/calendarEvent.model'
// import { User, UserSchema } from '../user/user.model'

import { Follower, FollowerSchema } from '@modules/follower/follower.model'
import { FollowerService } from '@modules/follower/follower.service'

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
