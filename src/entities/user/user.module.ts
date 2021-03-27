import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// import { AuthService } from '../auth/auth.service'
import { UserService } from './user.service'
import { User, UserSchema } from './user.model'
import { UserResolver } from './user.resolver'
// import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    // AuthModule,
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
export class UserModule { }
