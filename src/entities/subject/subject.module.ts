import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SubjectService } from './subject.service'
import { Subject, SubjectSchema } from './subject.model'
import { SubjectResolver } from './subject.resolver'

import { Calendar, CalendarSchema } from '../calendar/calendar.model'
import { School, SchoolSchema } from '../school/school.model'

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
    ]),
  ],
  //   controllers: [SchoolsController],
  providers: [SubjectService, SubjectResolver],
})
export class SubjectModule { }
