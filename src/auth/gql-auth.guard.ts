import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  public constructor(private readonly reflector: Reflector) {
    super()
  }

  // public canActivate( context: ExecutionContext ): boolean {

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
    //console.log('[GqlAuthGuard] - 1')
    const ctx = GqlExecutionContext.create(context)
    //const user = ctx.getContext<CT.GQL.CTX>().req?.user
    //console.log(user)
    const req = ctx.getContext().req
    console.log('[GqlAuthGuard] - 2', { ctx, context, req, thiss: this })
    return req
  }
}
