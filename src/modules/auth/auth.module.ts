import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
// import { MongooseModule } from '@nestjs/mongoose'

import { UserModule } from '@modules/user/user.module'
import { JwtStrategy } from './jwt.strategy'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { jwtConstants } from './constants'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // register({defaultStrategy: 'bearer'})
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10d' },
    }),
    UserModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
