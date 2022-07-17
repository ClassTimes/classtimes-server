import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import mongoose from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '@modules/user/user.service'
import { User } from '@modules/user/user.model'
import { EConfiguration } from '@utils/enum'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EConfiguration.JWT_SECRET),
    })
    //console.log('[JwtStrategy] #constructor')
  }

  async validate(payload: CT.JWTPayload): Promise<User> {
    /**
     * Kinda convoluted, but the return value of this function determines
     * the value of the `user` key in the GQL context.
     */
    const { sub: userID } = payload
    let user: User
    try {
      const userObjectID = new mongoose.Types.ObjectId(userID)
      user = await this.userService.getById(userObjectID)
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      //console.log('[JwtStrategy] #validate', { payload, user })
    }
    return user
  }
}
