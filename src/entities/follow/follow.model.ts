import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

import * as Utils from '../../utils/Model'
import { User } from '../user/user.model'

// const Resource = GQL.createUnionType({
//   name: 'Resource',
//   types: () => [School, Subject],
// })

@GQL.ObjectType()
abstract class FollowBase extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId
}

//

@GQL.ObjectType()
export class Follow extends FollowBase {
  @GQL.Field(() => GQL.ID)
  resourceId: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  resourceName: string

  @GQL.Field(() => User)
  follower: mongoose.Types.ObjectId | User
}

@GQL.ObjectType()
export class UserFollow extends FollowBase {
  @GQL.Field(() => User)
  followeeId: mongoose.Types.ObjectId

  @GQL.Field(() => User, { description: 'Current User' })
  followerId: mongoose.Types.ObjectId
}
