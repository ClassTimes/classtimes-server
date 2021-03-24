import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserService } from './user.service'
import { User, UserSchema } from './user.model'
import { UserResolver } from './user.resolver'
// import { AuthService } from '../auth/auth.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  // components: [AuthService],
  providers: [UserService, UserResolver],
  exports: [UserService], // ?
})
export class UserModule {}
