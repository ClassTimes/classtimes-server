import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CareerService } from './career.service'
import { Career, CareerSchema } from './career.model'
import { CareerResolver } from './career.resolver'

import {
  CareerSubject,
  CareerSubjectSchema,
} from '@entities/careerSubject/careerSubject.model'
import { CareerSubjectService } from '@entities/careerSubject/careerSubject.service'

// School
import { School, SchoolSchema } from '@modules/school/school.model'
import { SchoolService } from '@modules/school/school.service'

// User
import { User, UserSchema } from '@modules/user/user.model'

// import { Institute, InstituteSchema } from '../institute/institute.model'
// import { InstituteService } from '../institute/institute.service'

// import { UserResolver } from '../user/user.resolver'

// import { Follower, FollowerSchema } from '../follower/follower.model'
// import { FollowerService } from '../follower/follower.service'
// import { Following, FollowingSchema } from '../following/following.model'
// import { FollowingService } from '../following/following.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Career.name,
        schema: CareerSchema,
      },
      {
        name: CareerSubject.name,
        schema: CareerSubjectSchema,
      },
      {
        name: School.name,
        schema: SchoolSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    CareerService,
    CareerResolver,
    CareerSubjectService,
    SchoolService,
  ],
})
export class CareerModule {}
