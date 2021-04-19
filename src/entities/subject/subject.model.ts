import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }
import { toCursorHash, Paginated } from '../../utils/Pagination'

import * as Utils from '../../utils/Model'
import { Calendar } from '../calendar/calendar.model'
import { School } from '../school/school.model'

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

  @GQL.Field(() => [Calendar])
  @Utils.OneToMany()
  calendars: mongoose.Types.ObjectId[] | Calendar[]

  @GQL.Field(() => School)
  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    autopopulate: true,
  })
  school: mongoose.Types.ObjectId | School

  @GQL.Field(() => Number)
  @DB.Prop({ type: Number, default: 0 })
  followerCounter: number
}

export type SubjectDocument = Subject & mongoose.Document
export const SubjectSchema = Subject.schema
SubjectSchema.index({ createdAt: 1 })
SubjectSchema.virtual('cursor').get(function () {
  if (this.createdAt) {
    const date = new Date(this.createdAt)
    return toCursorHash(date.toISOString())
  }
  return null
})
SubjectSchema.plugin(autopopulate)

@GQL.ObjectType()
export class PaginatedSubjects extends Paginated(Subject) {}
