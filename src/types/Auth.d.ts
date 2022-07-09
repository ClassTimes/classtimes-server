declare namespace CT {
  type User = import('@modules/user/user.model').User

  interface JWTPayload {
    sub: string
    username: string
  }

  interface JWTLoginResponse {
    user: User
    jwt: string
  }

  namespace GQL {
    interface CTX {
      req?: { user?: User }
    }
  }
}
