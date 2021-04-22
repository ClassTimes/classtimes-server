import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { Paginated, PaginatedType, withCursor } from '../../utils/Pagination'

// Entities
import { Subject } from '../subject/subject.model'
import {
  CalendarEvent,
  PaginatedCalendarEvents,
} from '../calendarEvent/calendarEvent.model'
import { User, PaginatedUsers } from '../user/user.model'

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

  /*
   *  Relations
   */

  @GQL.Field(() => Subject)
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    autopopulate: true,
  })
  subject: mongoose.Types.ObjectId | Subject

  @GQL.Field(() => GQL.Int)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  /*
   *  Connections
   */

  @GQL.Field(() => PaginatedCalendarEvents, { nullable: true })
  calendarEventsConnection: PaginatedType<CalendarEvent>

  @GQL.Field(() => PaginatedUsers, { nullable: true })
  usersFollowerConnection: PaginatedType<User>
}

export type CalendarDocument = Calendar & mongoose.Document
export const CalendarSchema = withCursor(Calendar.schema)
CalendarSchema.plugin(autopopulate)

@GQL.ObjectType()
export class PaginatedCalendars extends Paginated(Calendar) {}
