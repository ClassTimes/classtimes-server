import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CalendarService } from './calendar.service'
import { Calendar, CalendarSchema } from './calendar.model'
import { CalendarResolver } from './calendar.resolver'
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
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),
  ],
  //  controllers: [CalendarsController],
  providers: [CalendarService, CalendarResolver],
})
export class CalendarModule { }
