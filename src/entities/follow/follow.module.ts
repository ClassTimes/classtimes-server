import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FollowResolver } from './follow.resolver'

import { Follower, FollowerSchema } from '@entities/follower/follower.model'
import { FollowerService } from '@entities/follower/follower.service'

import { Following, FollowingSchema } from '@entities/following/following.model'
import { FollowingService } from '@entities/following/following.service'

import { School, SchoolSchema } from '@modules/school/school.model'
import { SchoolService } from '@modules/school/school.service'

import { Subject, SubjectSchema } from '@entities/subject/subject.model'
import { SubjectService } from '@entities/subject/subject.service'

import { Institute, InstituteSchema } from '@entities/institute/institute.model'
import { InstituteService } from '@entities/institute/institute.service'

import {
  CalendarEvent,
  CalendarEventSchema,
} from '@entities/calendarEvent/calendarEvent.model'
import { CalendarEventService } from '@entities/calendarEvent/calendarEvent.service'

import { Event, EventSchema } from '@modules/event/event.model'
import { EventService } from '@modules/event/event.service'

import { User, UserSchema } from '@modules/user/user.model'
import { UserService } from '@modules/user/user.service'

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
    CalendarEventService,
    EventService,
    UserService,
  ],
})
export class FollowModule {}
