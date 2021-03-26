import { Injectable } from '@nestjs/common'
import {
  //   ForbiddenError,
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability'

import type { User } from '../user/user.model'
import type { School } from '../school/school.model'

type Subjects = InferSubjects<typeof School | typeof User> | 'all'

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  //  createForUser(user: User) {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    console.log('[CaslAbilityFactory] #createForUser', {
      user,
      can,
      cannot,
      build,
    })

    // if (user.isAdmin) {
    //   can(Action.Manage, 'all') // read-write access to everything
    // } else {
    //   can(Action.Read, 'all') // read-only access to everything
    // }

    // can(Action.Update, Article, { authorId: user.id })
    // cannot(Action.Delete, Article, { isPublished: true })

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
