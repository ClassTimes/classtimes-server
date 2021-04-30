import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'
import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { Connected, ConnectionType, withCursor } from '../../utils/Connection'

// Entities
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'
import { User, ConnectedUsers } from '../user/user.model'

// Embedded documents
import { Comment } from '../comment/comment.model'
import { VirtualLocation } from '../virtualLocation/virtualLocation.model'

@GQL.ObjectType()
@DB.Schema({
  autoIndex: true,
})
export class Event extends Utils.BaseModel {
  constructor(calendarEvent: CalendarEvent) {
    super()
    this.calendarEvent = calendarEvent
  }

  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: true })
  description: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  presentialLocation: string

  @GQL.Field(() => VirtualLocation, { nullable: true })
  @DB.Prop({ type: VirtualLocation, required: false })
  virtualLocation: VirtualLocation

  @GQL.Field(() => Date)
  @DB.Prop({ required: true })
  startDateUtc: Date

  @GQL.Field(() => [Comment], { nullable: true })
  @DB.Prop({ type: Comment, required: false })
  comments: Comment[]

  /*
   *  Relations
   */

  @GQL.Field(() => GQL.Int)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => CalendarEvent, { nullable: false })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CalendarEvent',
    required: true,
  })
  calendarEvent: mongoose.Types.ObjectId | CalendarEvent

  /*
   *  Connections
   */

  @GQL.Field(() => ConnectedUsers, { nullable: true })
  usersJoiningConnection: ConnectionType<User>
}

export type EventDocument = Event & mongoose.Document
export const EventSchema = withCursor(Event.schema)
EventSchema.plugin(autopopulate)

@GQL.ObjectType()
export class ConnectedEvents extends Connected(Event) {}
