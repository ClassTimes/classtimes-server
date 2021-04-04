import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  public constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // Public resolvers whitelisting
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    )
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    return req
  }
}
