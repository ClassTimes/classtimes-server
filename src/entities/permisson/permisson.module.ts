import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// import { SchoolService } from './school.service'
// import { SchoolResolver } from './school.resolver'
import { School, SchoolSchema } from '@modules/school/school.model'
import { Subject, SubjectSchema } from '@entities/subject/subject.model'
import { Institute, InstituteSchema } from '@entities/institute/institute.model'
import { User, UserSchema } from '@modules/user/user.model'

import { PermissonResolver } from './permisson.resolver'
import { PermissonService } from './permisson.service'

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
    ]),
  ],
  //   controllers: [SchoolsController],
  providers: [PermissonResolver, PermissonService],
})
export class PermissonModule {}
