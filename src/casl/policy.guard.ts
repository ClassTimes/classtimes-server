import {
  Injectable,
  SetMetadata,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory'

interface IPolicyHandler {
  handle(ability: AppAbility): boolean
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export const CHECK_POLICIES_KEY = 'check_policy'
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers)

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  //async canActivate(context: ExecutionContext): Promise<boolean> {
  canActivate(context: ExecutionContext) {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || []

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    )
    if (isPublic) {
      // Whitelist public resolvers
      // (for now, only loginUser)
      return true
    }

    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    const user = req?.user
    console.log('[Policy.Guard] [User]', user)

    if (user) {
      const ability = this.caslAbilityFactory.createForUser(user)
      const result = policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability),
      )
      console.log('[Ability result] ', result)
      return result
    }

    //throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED)
    /*const ability = this.caslAbilityFactory.createForUser(user)
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    )*/
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability)
    }
    return handler.handle(ability)
  }
}
