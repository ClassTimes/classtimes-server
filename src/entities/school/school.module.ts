import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SchoolService } from './school.service'
import { School, SchoolSchema } from './school.model'
import { SchoolResolver } from './school.resolver'

import { Career, CareerSchema } from '../career/career.model'
import { CareerService } from '../career/career.service'

import { Subject, SubjectSchema } from '../subject/subject.model'
import { SubjectService } from '../subject/subject.service'

import { Institute, InstituteSchema } from '../institute/institute.model'
import { InstituteService } from '../institute/institute.service'

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
        name: Career.name,
        schema: CareerSchema,
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
    CareerService,
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
