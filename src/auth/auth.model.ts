import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }

import * as Utils from '../utils/Model'
import { User } from '../entities/user/user.model'

@GQL.ObjectType()
export class Auth extends Utils.BaseModel {
  @GQL.Field(() => String, { nullable: false })
  jwt: string

  // Relations
  @GQL.Field(() => User, { nullable: false })
  user: User // mongoose.Types.ObjectId |
}

// export type UserDocument = User & mongoose.Document
// export const UserSchema = User.schema
// UserSchema.index({ field1: 1, field2: 1 }, { unique: true })

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
