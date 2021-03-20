import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CalendarEventService } from './calendarEvent.service'
import { CalendarEvent, CalendarEventSchema } from './calendarEvent.model'
import { CalendarEventResolver } from './calendarEvent.resolver'
import { Calendar, CalendarSchema } from '../calendar/calendar.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CalendarEvent.name,
        schema: CalendarEventSchema,
      },
      {
        name: Calendar.name,
        schema: CalendarSchema,
      },
    ]),
  ],
  //  controllers: [CalendarsController],
  providers: [CalendarEventService, CalendarEventResolver],
})
export class CalendarEventModule {}
