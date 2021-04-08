import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CalendarService } from './calendar.service'
import { Calendar, CalendarSchema } from './calendar.model'
import { CalendarResolver } from './calendar.resolver'

import {
  CalendarEvent,
  CalendarEventSchema,
} from '../calendarEvent/calendarEvent.model'
import { CalendarEventService } from '../calendarEvent/calendarEvent.service'
import { Subject, SubjectSchema } from '../subject/subject.model'
// import { SchoolController } from './entities/schools.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Calendar.name,
        schema: CalendarSchema,
      },
      {
        name: CalendarEvent.name,
        schema: CalendarEventSchema,
      },
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),
  ],
  //  controllers: [CalendarsController],
  providers: [CalendarService, CalendarResolver, CalendarEventService],
})
export class CalendarModule {}
