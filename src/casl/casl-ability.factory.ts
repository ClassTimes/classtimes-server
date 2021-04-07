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
import { Calendar } from '../entities/calendar/calendar.model'
import { Auth } from '../auth/auth.model'

type Subjects =
  | InferSubjects<
      | typeof School
      | typeof User
      | typeof Subject
      | typeof Calendar
      | typeof Auth
    >
  | 'all'

export enum Action {
  // *manage* and *all* are special keywords in CASL.
  // *manage* represents any action and *all* represents any subject
  // https://casl.js.org/v5/en/guide/intro
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  List = 'list',
  GrantPermisson = 'grantPermisson',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = Ability<[Action, Subjects]>

// roles: {
//   superAdmin: boolean,
//   professors: User[],
//   admins: User[]
// }

export class CaslAbilityFactory {
  static createForUser(user: User | undefined) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    // Public Resources
    can([Action.Read], School)
    console.log('[User] ', user)
    if (user) {
      // Super admin abilities
      if (user?.roles?.superAdmin) {
        can(Action.Manage, School)
        can(Action.Manage, Subject)
      }

      // Any logged in user can...
      can(Action.Manage, Auth)

      // School abilities
      can([Action.Update, Action.Delete], School, {
        'createdBy._id': user._id,
      } as any) // Obsolete

      // Subject abilities
      can([Action.Read], Subject) // TODO: Add search Action
      can([Action.Update], Subject, {
        'roles.admin.userId': user._id,
      } as any)
      can([Action.Create, Action.Delete], Subject, {
        'school.roles.admin.userId': user._id,
      } as any)

      // Calendar abilities
      //can([Action.Read], Subject) // TODO: Add search Action
      // can([Action.Update], Subject, {
      //   'roles.admin.userId': user._id,
      // } as any)
      can([Action.Create], Calendar, {
        'calendar.subject.roles.admin.userId': user._id,
      } as any)

      // Writing permissons
      can([Action.GrantPermisson], School, {
        'roles.admin.userId': user._id,
      } as any)
      can([Action.GrantPermisson], Subject, {
        'roles.admin.userId': user._id,
        'school.roles.admin.userId': user._id,
      } as any)
    }

    // TODO: Action.Update tiene que whitelistearse por key

    // User abilities
    can([Action.Read, Action.Create], User)
    can([Action.Update], User, ['email', 'username'], { _id: user._id })

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
