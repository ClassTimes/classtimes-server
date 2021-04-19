import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import * as Utils from '../../utils/Model'
import { toCursorHash, Paginated } from '../../utils/Pagination'

// import { Subject } from '../subject/subject.model'
import { Subject, PaginatedSubjects } from '../subject/subject.model'
import { User } from '../user/user.model'

//@Utils.HasMany({ field: 'subjects', ref: 'Subject' })
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

  // Pagination TODO: Move to Paginated type
  @GQL.Field(() => String)
  cursor: string

  // Relations

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

  @GQL.Field(() => [Subject], { nullable: true })
  @Utils.OneToMany()
  subjects: mongoose.Types.ObjectId[] | Subject[]

  // Pagination tests
  @GQL.Field(() => PaginatedSubjects, { nullable: true })
  subjectsConnection: any

  @GQL.Field(() => [School], { nullable: true })
  @Utils.OneToMany({
    ref: 'School',
    localField: '_id',
    foreignField: 'parentSchool',
  })
  childrenSchools: mongoose.Types.ObjectId[] | School[]
}

export type SchoolDocument = School & mongoose.Document
export const SchoolSchema = School.schema
SchoolSchema.index({ createdAt: 1 })
SchoolSchema.virtual('cursor').get(function () {
  const date = new Date(this.createdAt)
  return toCursorHash(date.toISOString())
})
SchoolSchema.plugin(autopopulate)

@GQL.ObjectType()
export class PaginatedSchools extends Paginated(School) {}
