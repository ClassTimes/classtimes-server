import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { SchoolService } from './school.service'
import { School, SchoolSchema } from './school.model'
import { SchoolResolver } from './school.resolver'
// import { SchoolController } from './entities/schools.controller';
// import { School, SchoolSchema } from './schemas/school.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: School.name,
        schema: SchoolSchema,
      },
    ]),
  ],
  //   controllers: [SchoolsController],
  providers: [SchoolService, SchoolResolver],
})
export class SchoolModule { }
