import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { InstituteService } from './institute.service'
import { Institute, InstituteSchema } from './institute.model'
import { InstituteResolver } from './institute.resolver'

import { SchoolService } from '../school/school.service'
import { School, SchoolSchema } from '../school/school.model'
import { SchoolResolver } from '../school/school.resolver'

import { Subject, SubjectSchema } from '../subject/subject.model'
import { SubjectService } from '../subject/subject.service'

import { User, UserSchema } from '../user/user.model'
import { UserService } from '../user/user.service'
import { UserResolver } from '../user/user.resolver'

import { Follower, FollowerSchema } from '../follower/follower.model'
import { FollowerService } from '../follower/follower.service'
import { Following, FollowingSchema } from '../following/following.model'
import { FollowingService } from '../following/following.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Institute.name,
        schema: InstituteSchema,
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
    InstituteService,
    InstituteResolver,
    SchoolService,
    SubjectService,
    UserService,
    UserResolver,
    FollowerService,
    FollowingService,
  ],
})
export class InstituteModule {}
