import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SubjectService } from './subject.service'
import { Subject, SubjectSchema } from './subject.model'
import { SubjectResolver } from './subject.resolver'


// import { SchoolController } from './entities/schools.controller';
// import { School, SchoolSchema } from './schemas/school.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),
  ],
  //   controllers: [SchoolsController],
  providers: [SubjectService, SubjectResolver],
})
export class SubjectModule { }
