import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { Connected, ConnectionType, withCursor } from '../../utils/Connection'

// Entities
import { Calendar } from '../calendar/calendar.model'
import { Event, ConnectedEvents } from '../event/event.model'
import { User, ConnectedUsers } from '../user/user.model'

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

  @GQL.Field(() => Date, { nullable: false })
  @DB.Prop({ required: true })
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

  /*
   *  Relations
   */

  @GQL.Field(() => GQL.Int)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => Calendar, { nullable: false })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
    autopopulate: true,
  })
  calendar: mongoose.Types.ObjectId | Calendar

  /*
   *  Connections
   */

  @GQL.Field(() => ConnectedEvents, { nullable: true })
  eventsConnection: ConnectionType<Event>

  @GQL.Field(() => ConnectedUsers, { nullable: true })
  usersSubscriberConnection: ConnectionType<User>

  // @DB.Prop({
  //   type: String,
  //   required: true,
  //   enum: [ClickedLinkEvent.name, SignUpEvent.name],
  // })
  // kind: string

  // TODO Person(studend) is Attending a class / not attending? (make friends! and chat)
}

export type CalendarEventDocument = CalendarEvent & mongoose.Document
export const CalendarEventSchema = withCursor(CalendarEvent.schema)
CalendarEventSchema.index({ startDateUtc: 1, endDateUtc: -1 })
CalendarEventSchema.plugin(autopopulate)

@GQL.ObjectType()
export class ConnectedCalendarEvents extends Connected(CalendarEvent) {}

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
