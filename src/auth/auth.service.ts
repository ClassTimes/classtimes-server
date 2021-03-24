import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'

// User
import { UserService } from '../user/user.service'
import { LoginInput } from './auth.inputs'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async login(payload: LoginInput) {
    const user = await this.usersService.findByEmailOrUsername(
      payload.emailOrUsername,
    )
    if (user) {
      try {
        const match = await bcrypt.compare(payload.password, user.password)
        console.log(`User auth ok -- ${user.username} : ${match}`)
        // if(match) {
        // }else{
        // TODO ERROR INVALID REASON?
        // }
      } catch (error) {
        console.error(error)
        throw error
      }

      const { password, ...result } = user
      return result
    }
    return null
  }
}
