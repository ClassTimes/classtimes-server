import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { Calendar } from '../calendar/calendar.model'
import { School } from '../school/school.model'
import { User } from '../user/user.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class Subject extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => [Calendar])
  @Utils.OneToMany()
  calendars: mongoose.Types.ObjectId[] | Calendar[]

  @GQL.Field(() => School)
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    autopopulate: true,
  })
  school: mongoose.Types.ObjectId | School

  // @GQL.Field(() => [User])
  // @DB.Prop({
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: 'User',
  //   autopopulate: true,
  // })
  // professors: mongoose.Types.ObjectId[] | User[]

  // @GQL.Field(() => [User])
  // @DB.Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   autopopulate: true,
  // })
  // admins: mongoose.Types.ObjectId[] | User[]
}

export type SubjectDocument = Subject & mongoose.Document
export const SubjectSchema = Subject.schema
SubjectSchema.plugin(autopopulate)
