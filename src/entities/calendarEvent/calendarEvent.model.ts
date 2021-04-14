import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'

// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

import * as Utils from '../../utils/Model'
import { Event } from '../event/event.model'
import { Calendar } from '../calendar/calendar.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class CalendarEvent extends Utils.BaseModel {
  constructor(calendar: Calendar) {
    super()
    this.calendar = calendar
  }

  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: false })
  @DB.Prop({ required: true })
  title: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  description: string

  // Add event tags
  @GQL.Field(() => [String])
  @DB.Prop({ default: [] })
  tags: string[]

  @GQL.Field(() => Date, { nullable: false })
  @DB.Prop({ required: true })
  startDateUtc: Date

  // @DB.Prop({ required: true }) // TODO STORE IT AND INDEX IT!
  @GQL.Field(() => Date, { nullable: false })
  endDateUtc: Date

  @GQL.Field(() => Boolean, { nullable: true })
  @DB.Prop({ required: false })
  isAllDay: boolean

  @GQL.Field(() => Number, { nullable: false })
  @DB.Prop({ required: false })
  durationHours: number

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  rrule: string

  @GQL.Field(() => [Date], { nullable: true })
  @DB.Prop({ required: false })
  exceptionsDatesUtc: Date[]

  @GQL.Field(() => Number)
  @DB.Prop({ type: Number, default: 0 })
  followingCounter: number

  // @DB.Prop({
  //   type: String,
  //   required: true,
  //   enum: [ClickedLinkEvent.name, SignUpEvent.name],
  // })
  // kind: string

  // TODO Person(studend) is Attending a class / not attending? (make friends! and chat)

  // Relations
  @GQL.Field(() => Calendar, { nullable: false })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
    autopopulate: true,
  })
  calendar: mongoose.Types.ObjectId | Calendar

  @GQL.Field(() => [Event])
  @Utils.OneToMany()
  events: mongoose.Types.ObjectId[] | Event[]
}

export type CalendarEventDocument = CalendarEvent & mongoose.Document
export const CalendarEventSchema = CalendarEvent.schema

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
