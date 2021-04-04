import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

// User
import { UserService } from '../entities/user/user.service'
import { LoginInput } from './auth.inputs'
import { AuthenticationError } from './auth.errors'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(payload: LoginInput): Promise<CT.JWTLoginResponse> | undefined {
    const user = await this.usersService.findByEmailOrUsername(
      payload.emailOrUsername, // TODO Cache per request?
    )
    if (user) {
      try {
        const match = await bcrypt.compare(payload.password, user.passwordHash)
        if (match) {
          // const { password, ...result } = user
          const jwtPayload: CT.JWTPayload = {
            sub: user._id.toHexString(),
            username: user.username,
          }
          const jwt = this.jwtService.sign(jwtPayload)
          return { jwt, user }
        } else {
          throw new AuthenticationError('AuthenticationError') // Wrong password
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    }
    throw new AuthenticationError('AuthenticationError') // User not found
  }
}
