import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { User } from '../entities/user/user.model'

export const CurrentUser = createParamDecorator<
  unknown,
  ExecutionContext,
  User
>((data, context) => {
  console.log('[CurrentUser] - 1')
  const ctx = GqlExecutionContext.create(context)
  const user = ctx.getContext<CT.GQL.CTX>().req?.user
  console.log('[CurrentUser] - 2', { ctx, user })
  return user
})
