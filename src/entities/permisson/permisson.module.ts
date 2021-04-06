import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// import { SchoolService } from './school.service'
// import { SchoolResolver } from './school.resolver'
import { School, SchoolSchema } from '../school/school.model'

import { Subject, SubjectSchema } from '../subject/subject.model'

import { User, UserSchema } from '../user/user.model'

import { Calendar, CalendarSchema } from '../calendar/calendar.model'

import {
  CalendarEvent,
  CalendarEventSchema,
} from '../calendarEvent/calendarEvent.model'

import { PermissonResolver } from './permisson.resolver'
import { PermissonService } from './permisson.service'
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
        name: User.name,
        schema: UserSchema,
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
  providers: [PermissonResolver, PermissonService],
})
export class PermissonModule {}
