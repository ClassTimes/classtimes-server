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
export class Follow extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => GQL.ID)
  resourceId: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  resourceName: string

  @GQL.Field(() => User)
  userId: mongoose.Types.ObjectId
}
