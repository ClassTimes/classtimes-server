import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FollowResolver } from './follow.resolver'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'

import { Following, FollowingSchema } from '../following/following.model'
import { FollowingService } from '../following/following.service'

import { School, SchoolSchema } from '../school/school.model'
import { SchoolService } from '../school/school.service'

import { Subject, SubjectSchema } from '../subject/subject.model'
import { SubjectService } from '../subject/subject.service'

import { Institute, InstituteSchema } from '../institute/institute.model'
import { InstituteService } from '../institute/institute.service'

import { Calendar, CalendarSchema } from '../calendar/calendar.model'
import { CalendarService } from '../calendar/calendar.service'

import {
  CalendarEvent,
  CalendarEventSchema,
} from '../calendarEvent/calendarEvent.model'
import { CalendarEventService } from '../calendarEvent/calendarEvent.service'

import { Event, EventSchema } from '../event/event.model'
import { EventService } from '../event/event.service'

import { User, UserSchema } from '../user/user.model'
import { UserService } from '../user/user.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
      {
        name: Following.name,
        schema: FollowingSchema,
      },
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
        name: CalendarEvent.name,
        schema: CalendarEventSchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    FollowResolver,
    FollowerService,
    FollowingService,
    SchoolService,
    SubjectService,
    InstituteService,
    CalendarService,
    CalendarEventService,
    EventService,
    UserService,
  ],
})
export class FollowModule {}
