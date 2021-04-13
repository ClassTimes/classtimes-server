import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import { ModuleRef } from '@nestjs/core'
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { School, SchoolDocument } from '../school/school.model'
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
export class Following extends Utils.BaseModel {
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

export type FollowingDocument = Following & mongoose.Document
export const FollowingSchema = Following.schema
FollowingSchema.index({ resourceId: 1, userId: 1 }, { unique: true })
FollowingSchema.plugin(autopopulate)
