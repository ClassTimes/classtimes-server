import {
  Injectable,
  SetMetadata,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
// import { GqlExecutionContext } from '@nestjs/graphql'

import {
  AppAbility,
  // CaslAbilityFactory
} from '../casl/casl-ability.factory'
interface IPolicyHandler {
  handle(ability: AppAbility): boolean
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export const CHECK_POLICIES_KEY = 'check_policy'
export const CheckPolicies = (...args: any[]) =>
  SetMetadata(CHECK_POLICIES_KEY, args)

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext) {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || []

    // Skip Auth Check
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    )
    if (isPublic) {
      // Whitelist public resolvers
      // (for now, only loginUser)
      return true
    }

    // Forbid by default when there's no policy set for the current action
    if (!policyHandlers?.length) {
      return false
    }

    // const ctx = GqlExecutionContext.create(context)
    // const req = ctx.getContext().req
    // const user = req?.user

    // const ability = this.caslAbilityFactory.createForUser(user)

    // const result = policyHandlers.every((handler) =>
    //   this.execPolicyHandler(handler, ability),
    // )
    // // const result = policyHandlers.map((policyHandlers) => policyHandlers())
    // // if (policyHandlers.every((handler) => handler.constructor === Promise)) {
    // //   result = Promise.all(
    // //   )
    // // } else {
    // //   result = policyHandlers.every((handler) =>
    // //     this.execPolicyHandler(handler, ability),
    // //   )
    // // }

    // console.log('[Policy.Guard] [User]', user)
    // console.log('[Policy.Guard] [Ability policies] ', policyHandlers)
    // console.log('[Policy.Guard] [Ability result] ', result)

    return true
    // return new Promise<boolean>((resolve) => {
    //   console.log('[Policy.Guard] wait 5 secs ')
    //   setTimeout(() => {
    //     console.log('[Policy.Guard] done!!! ')
    //     resolve(true)
    //   }, 5000)
    // }) // result
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability)
    }
    return handler.handle(ability)
  }
}
