import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
// import { School } from '../school/school.model'
// import { Subject } from '../subject/subject.model'
import { User } from '../user/user.model'

// const Resource = GQL.createUnionType({
//   name: 'Resource',
//   types: () => [School, Subject],
// })

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class Follower extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => GQL.ID)
  @DB.Prop()
  resourceId: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  resourceName: string

  @GQL.Field(() => User)
  @DB.Prop()
  userId: mongoose.Types.ObjectId
}

export type FollowerDocument = Follower & mongoose.Document
export const FollowerSchema = Follower.schema
FollowerSchema.index({ userId: 1, resourceId: 1 }, { unique: true })
FollowerSchema.plugin(autopopulate)
