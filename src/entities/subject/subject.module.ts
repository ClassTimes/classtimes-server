import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SubjectService } from './subject.service'
import { Subject, SubjectSchema } from './subject.model'
import { SubjectResolver } from './subject.resolver'

import { CalendarService } from '../calendar/calendar.service'
import { Calendar, CalendarSchema } from '../calendar/calendar.model'

import { School, SchoolSchema } from '../school/school.model'

import { CalendarEventService } from '../calendarEvent/calendarEvent.service'
import {
  CalendarEvent,
  CalendarEventSchema,
} from '../calendarEvent/calendarEvent.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
      {
        name: School.name,
        schema: SchoolSchema,
      },
      {
        name: Calendar.name,
        schema: CalendarSchema,
      },
      {
        name: CalendarEvent.name,
        schema: CalendarEventSchema,
      },
    ]),
  ],
  //   controllers: [SchoolsController],
  providers: [
    SubjectService,
    SubjectResolver,
    CalendarService,
    CalendarEventService,
  ],
})
export class SubjectModule {}
