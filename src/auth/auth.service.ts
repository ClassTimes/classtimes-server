import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'

// User
import { UserService } from '../user/user.service'
import { LoginInput } from './auth.inputs'
import { AuthenticationError } from './auth.errors'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(payload: LoginInput) {
    const user = await this.usersService.findByEmailOrUsername(
      payload.emailOrUsername,
    )
    if (user) {
      try {
        const match = await bcrypt.compare(payload.password, user.password)
        if (match) {
          // const { password, ...result } = user
          const jwtPayload = { sub: user._id, username: user.username }
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
