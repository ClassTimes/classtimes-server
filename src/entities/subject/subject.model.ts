import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'

// Pagination
import { Connected, ConnectionType, withCursor } from '../../utils/Connection'

// Entities
import { Calendar, ConnectedCalendars } from '../calendar/calendar.model'
import { School } from '../school/school.model'
import { Institute } from '../institute/institute.model'
import { User, ConnectedUsers } from '../user/user.model'

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

  @GQL.Field(() => ConnectedCalendars, { nullable: true })
  calendarsConnection: ConnectionType<Calendar>

  @GQL.Field(() => ConnectedUsers, { nullable: true })
  usersFollowerConnection: ConnectionType<User>
}

export type SubjectDocument = Subject & mongoose.Document
export const SubjectSchema = withCursor(Subject.schema)
SubjectSchema.plugin(autopopulate)

@GQL.ObjectType()
export class ConnectedSubjects extends Connected(Subject) {}
