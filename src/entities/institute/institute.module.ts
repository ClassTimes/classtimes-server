import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { InstituteService } from './institute.service'
import { Institute, InstituteSchema } from './institute.model'
import { InstituteResolver } from './institute.resolver'

import { SchoolService } from '@modules/school/school.service'
import { School, SchoolSchema } from '@modules/school/school.model'

import { Subject, SubjectSchema } from '@entities/subject/subject.model'
import { SubjectService } from '@entities/subject/subject.service'

import { User, UserSchema } from '@modules/user/user.model'
import { UserService } from '@modules/user/user.service'
import { UserResolver } from '@modules/user/user.resolver'

import { Follower, FollowerSchema } from '@modules/follower/follower.model'
import { FollowerService } from '@modules/follower/follower.service'
import { Following, FollowingSchema } from '@modules/following/following.model'
import { FollowingService } from '@modules/following/following.service'

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
