import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '@utils/Model'

// Pagination
import { Connected, ConnectionType, withCursor } from '@utils/Connection'

// Entities
import {
  CalendarEvent,
  ConnectedCalendarEvents,
} from '@entities/calendarEvent/calendarEvent.model'
import { School } from '@modules/school/school.model'
import { Institute } from '@entities/institute/institute.model'
import { User, ConnectedUsers } from '@modules/user/user.model'
import {
  Discussion,
  ConnectedDiscussions,
} from '@entities/discussion/discussion.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class Subject extends Utils.BaseModel {
  constructor(school?: School, institute?: Institute) {
    super()
    this.school = school
    this.institute = institute
  }

  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => String)
  @DB.Prop()
  shortName: string

  @GQL.Field(() => String)
  @DB.Prop()
  description: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  avatarImage: string

  // Add event tags
  @GQL.Field(() => [String])
  @DB.Prop({ default: [] })
  tags: string[]

  /*
   * Relations
   */

  @GQL.Field(() => GQL.Int)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => School)
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    autopopulate: true,
  })
  school: mongoose.Types.ObjectId | School

  @GQL.Field(() => Institute)
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    autopopulate: true,
  })
  institute: mongoose.Types.ObjectId | Institute

  /*
   *  Connections
   */

  @GQL.Field(() => ConnectedCalendarEvents, { nullable: true })
  calendarEventsConnection: ConnectionType<CalendarEvent>

  @GQL.Field(() => ConnectedDiscussions, { nullable: true })
  discussionsConnection: ConnectionType<Discussion>

  @GQL.Field(() => ConnectedUsers, { nullable: true })
  usersFollowerConnection: ConnectionType<User>
}

export type SubjectDocument = Subject & mongoose.Document
export const SubjectSchema = withCursor(Subject.schema as mongoose.Schema)
SubjectSchema.plugin(autopopulate)

@GQL.ObjectType()
export class ConnectedSubjects extends Connected(Subject) {}
