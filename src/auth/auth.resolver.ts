import * as GQL from '@nestjs/graphql'
// import mongoose from 'mongoose'

import { Auth } from './auth.model'
import { AuthService } from './auth.service'
import { LoginInput } from './auth.inputs'

@GQL.Resolver(() => Auth)
export class AuthResolver {
  constructor(private service: AuthService) {}

  @GQL.Mutation(() => Auth)
  async loginUser(@GQL.Args('payload') payload: LoginInput) {
    const { user, jwt } = await this.service.login(payload)
    if (user) {
      const response = { user, jwt }
      console.log('[AuthResolver] #loginUser', response)
      return response
    }
  }
}
