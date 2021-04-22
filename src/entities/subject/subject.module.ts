import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SubjectService } from './subject.service'
import { Subject, SubjectSchema } from './subject.model'
import { SubjectResolver } from './subject.resolver'

import { CalendarService } from '../calendar/calendar.service'
import { Calendar, CalendarSchema } from '../calendar/calendar.model'

import { School, SchoolSchema } from '../school/school.model'
import { Institute, InstituteSchema } from '../institute/institute.model'

import { CalendarEventService } from '../calendarEvent/calendarEvent.service'
import {
  CalendarEvent,
  CalendarEventSchema,
} from '../calendarEvent/calendarEvent.model'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: School.name,
        schema: SchoolSchema,
      },
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
      {
        name: Institute.name,
        schema: InstituteSchema,
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
  //   controllers: [SchoolsController],
  providers: [
    SubjectService,
    SubjectResolver,
    CalendarService,
    FollowerService,
  ],
})
export class SubjectModule {}
