import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CalendarEventService } from './calendarEvent.service'
import { CalendarEvent, CalendarEventSchema } from './calendarEvent.model'
import { CalendarEventResolver } from './calendarEvent.resolver'
import { Subject, SubjectSchema } from '@modules/subject/subject.model'
import { EventService } from '@modules/event/event.service'
import { Event, EventSchema } from '@modules/event/event.model'

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
        name: Subject.name,
        schema: SubjectSchema,
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
