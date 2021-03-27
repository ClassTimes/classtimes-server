import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { Calendar } from '../calendar/calendar.model'

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

  @GQL.Field(() => [Calendar])
  @DB.Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Calendar' })
  calendars: mongoose.Types.ObjectId[] | Calendar[]
}

export type SchoolDocument = School & mongoose.Document
export const SchoolSchema = School.schema
