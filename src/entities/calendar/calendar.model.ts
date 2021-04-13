import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

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
  constructor(subject: Subject) {
    super()
    this.subject = subject
  }

  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => Subject)
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    autopopulate: true,
  })
  subject: mongoose.Types.ObjectId | Subject

  @GQL.Field(() => [CalendarEvent])
  @Utils.OneToMany()
  calendarEvents: mongoose.Types.ObjectId[] | CalendarEvent[]

  @GQL.Field(() => Number)
  @DB.Prop({ type: Number, default: 0 })
  followingCounter: number
}

export type CalendarDocument = Calendar & mongoose.Document
export const CalendarSchema = Calendar.schema
