import * as DB from '@nestjs/mongoose' // { Prop, Schema, SchemaFactory }
import * as GQL from '@nestjs/graphql' // { Field, ObjectType, ID }
import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
// import * as V from 'class-validator' // { Prop, Schema, SchemaFactory }

// Pagination
import { withCursor } from '../../utils/Connection'

import * as Utils from '../../utils/Model'
import { Career } from '../career/career.model'
import { Subject } from '../subject/subject.model'

@GQL.ObjectType()
@DB.Schema({
  timestamps: true,
  // autoIndex: true
})
export class CareerSubject extends Utils.BaseModel {
  @GQL.Field(() => GQL.ID)
  _id: mongoose.Types.ObjectId

  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true,
  })
  careerId: mongoose.Types.ObjectId

  @GQL.Field(() => Career, {
    description:
      'A career is a collection of subjects with associated metadata',
  })
  @Utils.Virtual({
    propertyKey: 'career',
    ref: 'Career',
    localField: 'careerId',
    foreignField: '_id',
  })
  career: mongoose.Types.ObjectId | Career

  @DB.Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  })
  subjectId: mongoose.Types.ObjectId

  @GQL.Field(() => Subject, {
    description: 'One of the subjects belonging to a career',
  })
  @Utils.Virtual({
    propertyKey: 'subject',
    ref: 'Subject',
    localField: 'subjectId',
    foreignField: '_id',
  })
  subject: mongoose.Types.ObjectId | Subject

  /*
   *  Metadata
   */

  @GQL.Field()
  @DB.Prop({ default: false })
  isMandatory: boolean

  @GQL.Field(() => GQL.Int)
  @DB.Prop()
  semester: number
}

export type CareerSubjectDocument = CareerSubject & mongoose.Document
export const CareerSubjectSchema = withCursor(
  CareerSubject.schema as mongoose.Schema,
)
CareerSubjectSchema.index({ careerId: 1, subjectId: 1 }, { unique: true })
CareerSubjectSchema.plugin(autopopulate)
