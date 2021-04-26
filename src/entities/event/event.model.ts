import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'
import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { Paginated, PaginatedType, withCursor } from '../../utils/Pagination'

// Entities
import { CalendarEvent } from '../calendarEvent/calendarEvent.model'
import { User, PaginatedUsers } from '../user/user.model'

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

  @GQL.Field(() => String, { nullable: false })
  @DB.Prop({
    required: true,
  })
  @V.MinLength(10)
  content: string

  @GQL.Field(() => Date)
  @DB.Prop({ required: true })
  startDateUtc: Date

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

  @GQL.Field(() => PaginatedUsers, { nullable: true })
  usersJoiningConnection: PaginatedType<User>
}

export type EventDocument = Event & mongoose.Document
export const EventSchema = withCursor(Event.schema)
EventSchema.plugin(autopopulate)

@GQL.ObjectType()
export class PaginatedEvents extends Paginated(Event) {}
