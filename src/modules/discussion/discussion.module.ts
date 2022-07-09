import { Module } from '@nestjs/common'
import { MongooseModule, getModelToken } from '@nestjs/mongoose'

import { DiscussionService } from './discussion.service'
import { Discussion, DiscussionSchema } from './discussion.model'
import { DiscussionResolver } from './discussion.resolver'

import { Subject, SubjectSchema } from '@entities/subject/subject.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Discussion.name,
        schema: DiscussionSchema,
      },
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),
  ],
  providers: [DiscussionService, DiscussionResolver],
})
export class DiscussionModule {}
