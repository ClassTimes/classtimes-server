import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { EventService } from './event.service'
import { Event, EventSchema } from './event.model'
import { EventResolver } from './event.resolver'
// import { SchoolController } from './schools.controller';
import { Calendar, CalendarSchema } from '../calendar/calendar.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: Calendar.name,
        schema: CalendarSchema,
      },
    ]),
  ],
  //  controllers: [CalendarsController],
  providers: [EventService, EventResolver],
})
export class EventModule {}
