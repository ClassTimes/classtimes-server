import { Injectable } from '@nestjs/common'
import {
  //   ForbiddenError,
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability'

import { User } from '../entities/user/user.model'
import { School } from '../entities/school/school.model'

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
  createForUser(user: User | undefined) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    if (user?.roles?.includes('admin')) {
      can(Action.Read, School)
    }

    // cannot(Action.Read, 'all')
    // cannot(Action.Read, User)
    // cannot(Action.Delete, Article, { isPublished: true })
    // can(Action.Update, Article, { authorId: user.id })

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
