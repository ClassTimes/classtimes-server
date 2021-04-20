import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'

// Pagination
import { Paginated, PaginatedType, withCursor } from '../../utils/Pagination'

// Entities
import { Calendar, PaginatedCalendars } from '../calendar/calendar.model'
import { School } from '../school/school.model'
import { User, PaginatedUsers } from '../user/user.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class Subject extends Utils.BaseModel {
  constructor(school?: School) {
    super()
    this.school = school
  }

  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => String)
  @DB.Prop()
  shortName: string

  // Add event tags
  @GQL.Field(() => [String])
  @DB.Prop({ default: [] })
  tags: string[]

  // *
  // Relations
  // *

  @GQL.Field(() => Number)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => School)
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    autopopulate: true,
  })
  school: mongoose.Types.ObjectId | School

  // *
  // Connections
  // *

  @GQL.Field(() => PaginatedCalendars, { nullable: true })
  calendarsConnection: PaginatedType<Calendar>

  @GQL.Field(() => PaginatedUsers, { nullable: true })
  usersFollowerConnection: PaginatedType<User>
}

export type SubjectDocument = Subject & mongoose.Document
export const SubjectSchema = withCursor(Subject.schema)
SubjectSchema.plugin(autopopulate)

@GQL.ObjectType()
export class PaginatedSubjects extends Paginated(Subject) {}
