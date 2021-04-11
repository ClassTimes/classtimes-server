import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
//import { Subject } from '../subject/subject.model'
import { User } from '../user/user.model'

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
FollowerSchema.index({ userId: 1, resourceId: 1 })
FollowerSchema.plugin(autopopulate)
