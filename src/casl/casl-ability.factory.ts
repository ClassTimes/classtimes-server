import { Injectable } from '@nestjs/common'
import {
  //   ForbiddenError,
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability'
import { plainToClass } from 'class-transformer'

import { User } from '../entities/user/user.model'
import { School } from '../entities/school/school.model'
import { Subject } from '../entities/subject/subject.model'
import { Auth } from '../auth/auth.model'

type Subjects =
  | InferSubjects<typeof School | typeof User | typeof Subject | typeof Auth>
  | 'all'

export enum Action {
  // *manage* and *all* are special keywords in CASL.
  // *manage* represents any action and *all* represents any subject
  // https://casl.js.org/v5/en/guide/intro
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  List = 'list',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = Ability<[Action, Subjects]>

// @Injectable()
export class CaslAbilityFactory {
  static createForUser(user: User | undefined) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    // Super admin
    // if (user?.roles?.includes('admin')) {
    //   School
    //   can(Action.Manage, School)
    //   Subject
    //   can(Action.Manage, Subject)
    //   User
    //   can(Action.Manage, User)
    // }

    // Any user (incluing guests) can read, list, and create a school
    // can(Action.Read, School)
    // can(Action.List, School)
    //console.log('CAS AVILITY FACTOR', user)
    if (user) {
      // Any logged in user can...
      can(Action.Manage, Auth)

      // School abilities
      can(Action.Create, School)
      can(Action.List, School)
      can(Action.Read, School, { 'createdBy._id': user._id } as any)
      can(Action.Update, School, { 'createdBy._id': user._id } as any)
      can(Action.Delete, School, { 'createdBy._id': user._id } as any)
      if (user?.roles?.includes('admin')) {
        can(Action.Read, School)
      }
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
