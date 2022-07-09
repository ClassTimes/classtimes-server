import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SubjectService } from './subject.service'
import { Subject, SubjectSchema } from './subject.model'
import { SubjectResolver } from './subject.resolver'

import { School, SchoolSchema } from '@modules/school/school.model'
import { Institute, InstituteSchema } from '@entities/institute/institute.model'

import { DiscussionService } from '@entities/discussion/discussion.service'
import {
  Discussion,
  DiscussionSchema,
} from '@entities/discussion/discussion.model'

import { CalendarEventService } from '@entities/calendarEvent/calendarEvent.service'
import {
  CalendarEvent,
  CalendarEventSchema,
} from '@entities/calendarEvent/calendarEvent.model'

import { Follower, FollowerSchema } from '@entities/follower/follower.model'
import { FollowerService } from '@entities/follower/follower.service'

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
        name: Discussion.name,
        schema: DiscussionSchema,
      },
      {
        name: CalendarEvent.name,
        schema: CalendarEventSchema,
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
    CalendarEventService,
    DiscussionService,
    FollowerService,
  ],
})
export class SubjectModule {}
