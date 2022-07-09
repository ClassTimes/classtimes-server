import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql'
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '@utils/Model'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { Connected, ConnectionType, withCursor } from '@utils/Connection'

// Entities
import { Subject } from '@modules/subject/subject.model'
import { Event, ConnectedEvents } from '@modules/event/event.model'
import { User, ConnectedUsers } from '@modules/user/user.model'
import { VirtualLocation } from '@entities/virtualLocation/virtualLocation.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class CalendarEvent extends Utils.BaseModel {
  constructor(subject: Subject) {
    super()
    this.subject = subject
  }

  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: false })
  @DB.Prop({ required: true })
  title: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  description: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  presentialLocation: string

  @GQL.Field(() => VirtualLocation, { nullable: true })
  @DB.Prop({ type: VirtualLocation, required: false })
  virtualLocation: VirtualLocation

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

  @GQL.Field(() => GQL.ID, { nullable: true })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CalendarEvent',
    localField: 'basedOnCalendarEvents',
    required: false,
    autopopulate: true,
  })
  /*
   * This field links a CalendarEvent to another CalendarEvent from which
   * it was created from
   */
  basedOnCalendarEvent: mongoose.Types.ObjectId | CalendarEvent

  @GQL.Field(() => Subject, { nullable: false })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    autopopulate: true,
  })
  subject: mongoose.Types.ObjectId | Subject

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
export const CalendarEventSchema = withCursor(
  CalendarEvent.schema as mongoose.Schema,
)
CalendarEventSchema.index({ startDateUtc: 1, endDateUtc: -1 })
CalendarEventSchema.plugin(autopopulate)

@GQL.ObjectType()
export class ConnectedCalendarEvents extends Connected(CalendarEvent) {}

// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
