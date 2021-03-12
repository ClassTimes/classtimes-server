import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserService } from './user.service'
import { User, UserSchema } from './user.model'
import { UserResolver } from './user.resolver'
// import { SchoolController } from './schools.controller';

// import { Calendar, CalendarSchema } from '../calendar/calendar.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      // {
      //   name: Calendar.name,
      //   schema: CalendarSchema,
      // },
    ]),
  ],
  //  controllers: [CalendarsController],
  providers: [UserService, UserResolver],
})
export class UserModule {}
