import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '@modules/user/user.service'
import { User } from '@modules/user/user.model'
import { jwtConstants } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
    //console.log('[JwtStrategy] #constructor')
  }

  async validate(payload: CT.JWTPayload): Promise<User> {
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
    return user // { userId: payload.sub, username: payload.username }
  }
}
