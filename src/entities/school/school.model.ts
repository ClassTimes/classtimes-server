import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'

// Pagination
import { Paginated, PaginatedType, withCursor } from '../../utils/Pagination'

// Entities
import { Subject, PaginatedSubjects } from '../subject/subject.model'
import { User, PaginatedUsers } from '../user/user.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class School extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @GQL.Field(() => String)
  @DB.Prop()
  name: string

  @GQL.Field(() => String)
  @DB.Prop()
  shortName: string

  @GQL.Field(() => User, { nullable: false })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  createdBy: mongoose.Types.ObjectId | User

  // *
  // Relations
  // *

  @GQL.Field(() => Number)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => School, { nullable: true })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    autopopulate: true,
  })
  parentSchool: mongoose.Types.ObjectId | School

  // *
  // Connections
  // *

  @GQL.Field(() => PaginatedSubjects, { nullable: true })
  subjectsConnection: PaginatedType<Subject>

  @GQL.Field(() => PaginatedUsers, { nullable: true })
  usersFollowerConnection: PaginatedType<User>

  @GQL.Field(() => PaginatedSchools, { nullable: true })
  childrenSchoolsConnection: PaginatedType<School>
}

export type SchoolDocument = School & mongoose.Document
export const SchoolSchema = withCursor(School.schema)
SchoolSchema.plugin(autopopulate)
@GQL.ObjectType()
export class PaginatedSchools extends Paginated(School) {}
