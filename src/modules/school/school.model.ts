import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '@utils/Model'

// Pagination
import { Connected, ConnectionType, withCursor } from '@utils/Connection'

// Entities
import { Subject, ConnectedSubjects } from '@entities/subject/subject.model'
import {
  Institute,
  ConnectedInstitutes,
} from '@entities/institute/institute.model'
import { User, ConnectedUsers } from '@entities/user/user.model'

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

  @GQL.Field(() => String, { nullable: true })
  @DB.Prop({ required: false })
  avatarImage: string

  /*
   *  Relations
   */

  @GQL.Field(() => GQL.Int)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number

  @GQL.Field(() => School, { nullable: true })
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    autopopulate: true,
  })
  parentSchool: mongoose.Types.ObjectId | School

  /*
   *  Connections
   */

  @GQL.Field(() => ConnectedSubjects, { nullable: true })
  subjectsConnection: ConnectionType<Subject>

  @GQL.Field(() => ConnectedInstitutes, { nullable: true })
  institutesConnection: ConnectionType<Institute>

  @GQL.Field(() => ConnectedUsers, { nullable: true })
  usersFollowerConnection: ConnectionType<User>

  @GQL.Field(() => ConnectedSchools, { nullable: true })
  childrenSchoolsConnection: ConnectionType<School>
}

export type SchoolDocument = School & mongoose.Document
export const SchoolSchema = withCursor(School.schema as mongoose.Schema)
SchoolSchema.plugin(autopopulate)
@GQL.ObjectType()
export class ConnectedSchools extends Connected(School) {}
