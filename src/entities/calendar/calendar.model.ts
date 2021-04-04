import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { Subject } from '../subject/subject.model'
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class Calendar extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => Subject)
  @DB.Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  subject: mongoose.Types.ObjectId | Subject

  @GQL.Field(() => [CalendarEvent])
  @DB.Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'CalendarEvent' })
  calendarEvents: mongoose.Types.ObjectId[] | CalendarEvent[]
}

export type CalendarDocument = Calendar & mongoose.Document
export const CalendarSchema = Calendar.schema
