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

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User | undefined) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    // Super admin
    if (user?.roles?.includes('admin')) {
      // School
      // can(Action.Manage, School)
      // Subject
      // can(Action.Manage, Subject)
      // User
      // can(Action.Manage, User)
    }

    // Any user (incluing guests) can read, list, and create a school
    // can(Action.Read, School)
    // can(Action.List, School)

    if (user) {
      // Any logged in user can...
      can(Action.Manage, Auth)

      // Create a school
      // can(Action.Create, School)
      can(Action.Manage, School)

      // But only it's owner can manage it
      // user._id
      // { createdBy: "asdf" }
      // can(Action.Manage, School, {
      //   createdBy: { $eq: user._id },
      // }) // NOT WORKING
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
