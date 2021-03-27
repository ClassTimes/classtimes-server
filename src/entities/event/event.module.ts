import { Module } from '@nestjs/common'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'

import { EventService } from './event.service'
import { Event, EventSchema } from './event.model'
import { EventResolver } from './event.resolver'
// import {
//   CalendarEvent,
//   CalendarEventSchema,
// } from '../calendarEvent/calendarEvent.model'
// import { User, UserSchema } from '../user/user.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      // {
      //   name: CalendarEvent.name,
      //   schema: CalendarEventSchema,
      // },
      // {
      //   name: User.name,
      //   schema: UserSchema,
      // },
    ]),
  ],
  //  controllers: [EventController],
  providers: [
    EventService,
    EventResolver,
    // {
    //   provide: getModelToken(Event.name),
    //   useValue: eventModel,
    // },
  ],
})
export class EventModule { }
