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

    const { user } = context.switchToHttp().getRequest()
    console.log('[Current user]', user)
    if (user) {
      return true
    }

    throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED)
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
