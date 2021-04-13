import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FollowResolver } from './follow.resolver'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'
// import { FollowerResolver } from '../follower/follower.resolver'

import { Following, FollowingSchema } from '../following/following.model'
import { FollowingService } from '../following/following.service'
// import { FollowingResolver } from '../following/following.resolver'

import { School, SchoolSchema } from '../school/school.model'
import { SchoolService } from '../school/school.service'

import { Subject, SubjectSchema } from '../subject/subject.model'
import { SubjectService } from '../subject/subject.service'

import { Calendar, CalendarSchema } from '../calendar/calendar.model'
import { CalendarService } from '../calendar/calendar.service'
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
        name: Calendar.name,
        schema: CalendarSchema,
      },
    ]),
  ],
  providers: [
    FollowResolver,
    FollowerService,
    FollowingService,
    SchoolService,
    SubjectService,
    CalendarService,
  ],
})
export class FollowModule {}
