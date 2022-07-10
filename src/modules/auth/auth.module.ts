import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
// import { MongooseModule } from '@nestjs/mongoose'

import { UserModule } from '@modules/user/user.module'
import { JwtStrategy } from './jwt.strategy'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { EConfiguration } from '@utils/enum'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (_config: ConfigService) => ({
        secret: _config.get(EConfiguration.JWT_SECRET),
        signOptions: { expiresIn: '10d' },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
