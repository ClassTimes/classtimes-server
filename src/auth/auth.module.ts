import { Module } from '@nestjs/common'
// import { MongooseModule } from '@nestjs/mongoose'

import { AuthResolver } from './auth.resolver'
import { UserModule } from '../user/user.module'
// import { UserResolver } from './user.resolver'
// import { SchoolController } from './schools.controller';

// import { Calendar, CalendarSchema } from '../calendar/calendar.model'

@Module({
  imports: [
    UserModule,
    // MongooseModule.forFeature([
    //   {
    //     name: User.name,
    //     schema: UserSchema,
    //   },
    //   // {
    //   //   name: Calendar.name,
    //   //   schema: CalendarSchema,
    //   // },
    // ]),
  ],
  //  controllers: [CalendarsController],
  // providers: [UserService, UserResolver],
  providers: [AuthResolver],
})
export class AuthModule {}
