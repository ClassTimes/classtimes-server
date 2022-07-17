import { TestingModule } from '@nestjs/testing'
import { AuthService } from '@modules/auth/auth.service'

interface LoginInput {
  email: string
  password: string
}

/**
 * loginTestUser
 *
 * Logs a user into the test application, in order to provide a valid JWT token
 *
 * @param {LoginInput} input
 * @param {TestingModule} module
 * @returns {Promise<string>}
 */
export const loginTestUser = async (
  input: LoginInput,
  module: TestingModule,
) => {
  const authService = await module.get<AuthService>(AuthService)

  const { email: emailOrUsername, password } = input

  const { jwt } = await authService.login({
    emailOrUsername,
    password,
  })

  return jwt
}
