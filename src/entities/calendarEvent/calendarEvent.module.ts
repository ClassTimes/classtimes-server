import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CalendarEventService } from './calendarEvent.service'
import { CalendarEvent, CalendarEventSchema } from './calendarEvent.model'
import { CalendarEventResolver } from './calendarEvent.resolver'
import { Calendar, CalendarSchema } from '../calendar/calendar.model'
import { EventService } from '../event/event.service'
import { Event, EventSchema } from '../event/event.model'

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
        name: Calendar.name,
        schema: CalendarSchema,
      },
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
    ]),
  ],
  //  controllers: [CalendarsController],
  providers: [
    CalendarEventService,
    CalendarEventResolver,
    EventService,
    FollowerService,
  ],
})
export class CalendarEventModule {}
