import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
// import { MongooseModule } from '@nestjs/mongoose'

import { JwtStrategy } from './jwt.strategy'
import { jwtConstants } from './constants'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    UserModule,
    PassportModule, // register({defaultStrategy: 'bearer'})
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
