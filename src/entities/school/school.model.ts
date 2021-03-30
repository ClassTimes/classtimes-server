import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { Subject } from '../subject/subject.model'

//@Utils.HasMany({ field: 'subjects', ref: 'Subject' })
@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
@Utils.ValidateSchema()
export class School extends Utils.Model {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  //@DB.Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Subject' })
  @GQL.Field(() => [Subject])
  @Utils.OneToMany()
  subjects: mongoose.Types.ObjectId[] | Subject[]
}

export type SchoolDocument = School & mongoose.Document
export const SchoolSchema = School.schema
// SchoolSchema.virtual('subjects', {
//   ref: 'Subject',
//   localField: '_id',
//   foreignField: 'school'
// })

// SchoolSchema.set('toObject', { virtuals: true })
// SchoolSchema.set('toJSON', { virtuals: true })

