import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import { Connected, ConnectionType, withCursor } from '../../utils/Connection'
import * as Utils from '../../utils/Model'

// Entities
import { School, ConnectedSchools } from '../school/school.model'
import { Subject, ConnectedSubjects } from '../subject/subject.model'
import { Institute, ConnectedInstitutes } from '../institute/institute.model'
// import { Calendar, ConnectedCalendars } from '../calendar/calendar.model'
import {
  CalendarEvent,
  ConnectedCalendarEvents,
} from '../calendarEvent/calendarEvent.model'
import { Event, ConnectedEvents } from '../event/event.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class User extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false, min: 3, max: 100 })
  fullName: string

  @GQL.Field(() => String, { nullable: false })
  @DB.Prop({
    required: true,
    lowercase: true,
    unique: true,
    min: 3,
    max: 60,
  })
  username: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false, unique: true, lowercase: true })
  @V.IsEmail()
  email: string

  @DB.Prop({ required: true })
  passwordHash: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false, min: 3, max: 60 }) // unique: true,
  mobile: string

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  avatarImage: string

  // Counter caches

  @GQL.Field(() => GQL.Int)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => GQL.Int)
  @DB.Prop({ type: Number, default: 0 })
  followingCounter: number

  // *
  // Connections
  // *

  @GQL.Field(() => ConnectedUsers, { nullable: true })
  usersFollowerConnection: ConnectionType<User>

  @GQL.Field(() => ConnectedUsers, { nullable: true })
  usersFollowingConnection: ConnectionType<User>

  @GQL.Field(() => ConnectedSchools, { nullable: true })
  schoolsFollowingConnection: ConnectionType<School>

  @GQL.Field(() => ConnectedInstitutes, { nullable: true })
  institutesFollowingConnection: ConnectionType<Institute>

  @GQL.Field(() => ConnectedSubjects, { nullable: true })
  subjectsFollowingConnection: ConnectionType<Subject>

  @GQL.Field(() => ConnectedCalendarEvents, { nullable: true })
  calendarsEventsSubscribedConnection: ConnectionType<CalendarEvent>

  @GQL.Field(() => ConnectedEvents, { nullable: true })
  eventsJoiningConnection: ConnectionType<Event>
}

export type UserDocument = User & mongoose.Document
export const UserSchema = withCursor(User.schema as mongoose.Schema)
UserSchema.plugin(autopopulate)

@GQL.ObjectType()
export class ConnectedUsers extends Connected(User) {}

// UserSchema.index({ field1: 1, field2: 1 }, { unique: true })

//
// # Reference Link
//
// https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md
