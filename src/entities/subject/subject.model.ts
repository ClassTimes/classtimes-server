import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { Calendar } from '../calendar/calendar.model'
import { School } from '../school/school.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
@Utils.ValidateSchema()
export class Subject extends Utils.Model {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => [Calendar])
  @DB.Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Calendar' })
  calendars: mongoose.Types.ObjectId[] | Calendar[]

  @GQL.Field(() => School)
  @DB.Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School' })
  school: mongoose.Types.ObjectId | School
}

export type SubjectDocument = Subject & mongoose.Document
export const SubjectSchema = Subject.schema
