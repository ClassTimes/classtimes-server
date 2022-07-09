// import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
// import autopopulate from 'mongoose-autopopulate'
// // import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '@utils/Model'
// import { Subject } from '../subject/subject.model'
// import { User } from '../user/user.model'

// //@Utils.HasMany({ field: 'subjects', ref: 'Subject' })
@GQL.ObjectType()
// @DB.Schema({
//   timestamps: true,
//   // autoIndex: true
// })
export class Permisson extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  resourceId: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  resourceName: string

  @GQL.Field(() => GQL.ID)
  subjectId: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  role: string
}

// export type SchoolDocument = School & mongoose.Document
// export const SchoolSchema = School.schema
// SchoolSchema.plugin(autopopulate)
