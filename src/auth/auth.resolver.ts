import * as GQL from '@nestjs/graphql'

import { Auth } from './auth.model'
import { AuthService } from './auth.service'
import { LoginInput } from './auth.inputs'

@GQL.Resolver(() => Auth)
export class AuthResolver {
  constructor(private service: AuthService) {}

  @GQL.Mutation(() => Auth)
  async loginUser(
    @GQL.Args('payload') payload: LoginInput,
  ): Promise<CT.JWTLoginResponse> {
    const { user, jwt } = await this.service.login(payload)
    if (user) {
      const response: CT.JWTLoginResponse = { user, jwt }
      console.log('[AuthResolver] #loginUser', response)
      return response
    }
  }
}
