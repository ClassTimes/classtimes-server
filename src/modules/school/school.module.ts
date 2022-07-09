import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SchoolService } from './school.service'
import { School, SchoolSchema } from './school.model'
import { SchoolResolver } from './school.resolver'

import { Subject, SubjectSchema } from '@entities/subject/subject.model'
import { SubjectService } from '@entities/subject/subject.service'

import { Institute, InstituteSchema } from '@entities/institute/institute.model'
import { InstituteService } from '@entities/institute/institute.service'

import { User, UserSchema } from '@modules/user/user.model'
import { UserService } from '@modules/user/user.service'
import { UserResolver } from '@modules/user/user.resolver'

import { Follower, FollowerSchema } from '@entities/follower/follower.model'
import { FollowerService } from '@entities/follower/follower.service'
import { Following, FollowingSchema } from '@entities/following/following.model'
import { FollowingService } from '@entities/following/following.service'

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
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Follower.name,
        schema: FollowerSchema,
      },
      {
        name: Following.name,
        schema: FollowingSchema,
      },
    ]),
  ],
  //   controllers: [SchoolsController],
  providers: [
    SchoolService,
    SchoolResolver,
    SubjectService,
    InstituteService,
    UserService,
    UserResolver,
    FollowerService,
    FollowingService,
  ],
})
export class SchoolModule {}
