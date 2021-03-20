import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CalendarService } from './calendar.service'
import { Calendar, CalendarSchema } from './calendar.model'
import { CalendarResolver } from './calendar.resolver'
import { School, SchoolSchema } from '../school/school.model'
// import { SchoolController } from './schools.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Calendar.name,
        schema: CalendarSchema,
      },
      {
        name: School.name,
        schema: SchoolSchema,
      },
    ]),
  ],
  //  controllers: [CalendarsController],
  providers: [CalendarService, CalendarResolver],
})
export class CalendarModule {}
