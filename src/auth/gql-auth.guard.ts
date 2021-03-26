import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    console.log('[GqlAuthGuard] - 1')
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    // console.log('[GqlAuthGuard] - 2', { ctx, context, req, thiss: this })
    return req
  }
}
